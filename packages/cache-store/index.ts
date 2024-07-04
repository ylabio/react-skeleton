import { access, mkdir, readFile, unlink, writeFile } from 'fs/promises';
import mc from 'merge-change';
import gzip from 'node-gzip';
import path from 'path';
import uniqid from 'uniqid';
import type {
  ICacheStore,
  TCache,
  TCacheConfig,
  TCacheReadeCallback,
  TCacheValidateOptions
} from './types';

/**
 * Хранилище для кэширования рендера и состояния, с которым выполнялся рендер
 */
export class CacheStore implements ICacheStore {
  protected items: Map<string, TCache>;
  protected config: TCacheConfig;
  // Упорядоченные ключи items, чтобы освобождать память в порядке очереди
  protected itemsOrder: string[];
  protected listeners: Map<string, TCacheReadeCallback[]>;

  constructor(protected depends: {
    config: TCacheConfig
  }) {
    this.config = mc.merge(this.defaultConfig(), depends.config);
    this.items = new Map();
    this.itemsOrder = [];
    this.listeners = new Map();
  }

  protected defaultConfig(): TCacheConfig {
    return {
      // Подпись для валидации кэша после обновления приложения или запуска в разном режиме
      // При деплое подставляется хэш комита
      signature: `some`,
      // Максимальное количество страниц (кэшей) в оперативной памяти
      // Если кэша нет в пяти, то подгружается в память с диска
      // При достижении лимита первые (старые) записи освобождаются из памяти.
      maxItems: 50,
      // Сжимать кэш в gzip.
      compress: true,
      // Директория для файлов кэша
      dir: './cache'
    };
  }

  async init() {}

  /**
   * Создание ключа на основе массива параметров
   * Ключ в формате пути на файл
   */
  generateKey(values: (string | number | boolean)[]): string {
    if (values.length === 0)
      throw new Error('Need some values for generateKey');
    const url = new URL(values[0] as string, 'http://test');
    values[0] = url.search;
    const path = url.pathname.replace(/^[.]+/g, '');
    const prefix = values
      .map((value) => {
        switch (typeof value) {
          case 'string':
            return value.replace(/^[.?]+/g, '').replace(/[/\\]/g, 'slash');
          case 'number':
            return value.toString();
          case 'boolean':
            return value ? 'true' : 'false';
        }
      })
      .join('--');
    return path + (path.at(-1) === '/' ? '' : '/') + 'index--' + prefix;
  }

  async get(key: string): Promise<TCache | undefined> {
    const cache = this.items.get(key);
    if (!cache) {
      // Загрузка файла кэша
      try {
        const meta = await readFile(this.fileName(key).metaPath, 'utf-8');
        const data = JSON.parse(meta);
        data.html = await readFile(this.fileName(key).dataPath);

        this.items.set(key, data);
        this.keep(key);
      } catch {
        return undefined;
      }
    }
    // Загрузить файл кэша, если ещё не загружен?
    return this.items.get(key);
  }

  async isValidSignature(key: string): Promise<boolean> {
    const cache = await this.get(key);
    if (!cache || cache.waiting) return false;
    return cache.etag.startsWith(this.config.signature);
  }

  async isValid(key: string, options: TCacheValidateOptions): Promise<boolean> {
    const cache = await this.get(key);
    if (!cache || cache.waiting) return false;
    if (!cache.etag.startsWith(this.config.signature)) return false;

    // По дате валидности кэша на сервере
    if (options.date) {
      const age = Math.floor((options.date.getTime() - cache.time) / 1000);
      if (cache.maxAge >= age) return true;
    }
    // По ETag
    if (options['if-none-match']) {
      if (cache.etag === options['if-none-match']) return true;
    }
    // По дате обновления
    if (options['if-modified-since']) {
      const cacheTime = Math.floor(cache.time / 1000);
      const sinceTime = Math.floor(
        new Date(options['if-modified-since']).getTime() / 1000,
      );
      if (cacheTime <= sinceTime) return true;
    }
    return false;
  }

  async isWaiting(key: string, waitLimit: number = Infinity): Promise<boolean> {
    const cache = await this.get(key);
    const result = Boolean(cache && cache.waiting);
    if (waitLimit < Infinity && cache && result) {
      // Если кэш слишком долго в статусе ожидания, то вернём false
      const seconds = Math.floor((new Date().getTime() - cache.time) / 1000);
      return waitLimit > seconds;
    }
    return result;
  }

  /**
   * Установка ожидания готовности кэша (чтобы другие не обновляли кэш)
   * @param key
   */
  async waiting(key: string) {
    let cache = await this.get(key);
    if (!cache) {
      cache = {
        key,
        time: Date.now(),
        waiting: true,
        html: '',
        compressed: false,
        status: 200,
        location: undefined,
        etag: '',
        maxAge: 0,
      };
    } else {
      cache.waiting = true;
    }
    await this.save(cache);
  }

  /**
   * Удаление кэша
   * @param key
   */
  async remove(key: string) {
    try {
      await unlink(this.fileName(key).metaPath);
      await unlink(this.fileName(key).dataPath);
    } catch {}
    this.items.delete(key);
  }

  /**
   * Установка нового кэша.
   */
  async update(
    key: string,
    html: string,
    status: number = 200,
    maxAge: number,
    location?: string,
  ) {
    const data =
      status === 404 || location
        ? ''
        : this.config.compress
          ? await gzip.gzip(html)
          : html;
    const cache: TCache = {
      key,
      time: Date.now(),
      waiting: false,
      // Не храним html, если статус 404 или будет редирект
      html: data,
      compressed: Boolean(data && this.config.compress),
      status,
      location,
      etag: this.config.signature + uniqid(),
      maxAge: maxAge || 0,
    };
    this.items.set(key, cache);
    // Обновить файл кэша
    await this.save(cache);
    // Задержать кэш памяти
    this.keep(key);
    //
    (this.listeners.get(key) || []).map((callback) => callback(cache));
    this.listeners.delete(key);
  }

  /**
   * Сохранение кэша в файл
   * @param cache
   */
  protected async save(cache: TCache) {
    const { dirPath, metaPath, dataPath } = this.fileName(cache.key);
    // Директория для кэша
    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
    }

    try {
      await writeFile(metaPath, JSON.stringify({ ...cache, html: '' }), {
        encoding: 'utf-8',
        flag: 'w',
      });
      await writeFile(dataPath, cache.html, { flag: 'w' });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Удержать кэш в памяти
   * При этом из памяти будут удален самый первый кэш
   * @param key
   */
  protected keep(key: string) {
    if (this.itemsOrder.length >= this.config.maxItems) {
      const oldKey = this.itemsOrder.shift() as string;
      if (oldKey !== key) {
        this.items.delete(oldKey);
      }
    }
    if (this.items.has(key)) {
      this.itemsOrder.push(key);
    }
  }

  /**
   * Пути на файл кэша по его ключу
   * @param key
   */
  protected fileName(key: string) {
    const cachePath = this.config.dir + key;
    const dirPath = path.dirname(cachePath);
    const fileName = path.basename(cachePath);
    const metaPath = path.resolve(dirPath, fileName + '.json');
    const dataPath = path.resolve(dirPath, fileName + '.data');
    return { dirPath, fileName, metaPath, dataPath };
  }

  onReady(key: string, callback: TCacheReadeCallback) {
    const listeners = this.listeners.get(key) || [];
    listeners.push(callback);
    this.listeners.set(key, listeners);
  }
}


export class CacheStoreExt extends CacheStore {
  ext(): boolean {
    return true;
  }
}
