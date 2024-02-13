import uniqid from "uniqid";
import crypto from 'crypto';

export type TCacheConfig = {
  // @todo Возможность отключить кэш
  enabled?: boolean,
  // Время актуальности кэша в ms
  lifetime: number,
}

export type TCache = {
  // Ключ кэша в виде хэшированной строки
  key: string,
  // Ключ дампа
  secret: string,
  // Дата создания кэша
  time: number,
  // Признак ожидания рендера (процесса подготовки кэша)
  waiting: boolean,
  // Рендер html
  html: string,
  // Состояние с которым выполнялся рендер
  dump: any
}

/**
 * Хранилище для кэширования рендера и состояния, с которым выполнялся рендер
 */
export default class CacheStore {
  private items: Map<string, TCache>;
  private config: TCacheConfig;

  constructor(config: TCacheConfig) {
    this.items = new Map();
    this.config = config;
  }

  /**
   * Создание ключа на основе массива параметров
   */
  static generateKey(values: (string | number | boolean)[]): string {
    return crypto.createHash('md5').update(values.join('|')).digest("hex");
  }

  /**
   * Создание секрета для получения дампа
   * @param key Ключ кэширования (или соль)
   */
  static generateSecret(key: string): string {
    return uniqid(key);
  }

  getHtml(key: string): string | undefined {
    const cache = this.items.get(key);
    if (cache && cache.html) return cache.html;
    return undefined;
  }

  getDump(key: string, secret: string): any {
    const cache = this.items.get(key);
    if (cache && cache.secret === secret) return cache.dump;
    return undefined;
  }

  getSecret(key: string): string | undefined {
    const cache = this.items.get(key);
    if (cache) return cache.secret;
    return undefined;
  }

  isExists(key: string): boolean {
    const cache = this.items.get(key);
    return Boolean(cache && cache.html);
  }

  isOld(key: string): boolean {
    const cache = this.items.get(key);
    return Boolean(!cache || cache.time < Date.now() - this.config.lifetime);
  }

  isWaiting(key: string): boolean {
    const cache = this.items.get(key);
    return Boolean(cache && cache.waiting);
  }

  /**
   * Установка ожидания готовности кэша (чтобы другие не обновляли кэш)
   * @param key
   */
  waiting(key: string) {
    const cache = this.items.get(key);
    // Если кэш есть, то меняем только признак, чтобы кэш можно было продолжать отдавать
    if (cache) {
      cache.waiting = true;
    } else {
      this.items.set(key, {
        key,
        secret: '',
        time: 0,
        waiting: true,
        html: '',
        dump: undefined
      });
    }
  }

  /**
   * Удаление кэша
   * @param key
   */
  remove(key: string) {
    this.items.delete(key);
  }

  /**
   * Установка нового кэша.
   */
  update(key: string, html: string, dump: any) {
    this.items.set(key, {
      key,
      secret: uniqid(key),
      time: Date.now(),
      waiting: false,
      html,
      dump
    });
  }
}
