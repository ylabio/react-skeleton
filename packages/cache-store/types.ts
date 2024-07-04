import type { Buffer } from 'node:buffer';

export type TCacheConfig = {
  // Подпись (короткая строка), чтобы валидировать кэш после обновления приложения.
  // Предполагается подставлять переменную окружения. А её генерировать при сборке.
  signature: string;
  // Максимальное количество страниц (кэшей) в оперативной памяти
  // Если кэша нет в пяти, то подгружается в память с диска
  // При достижении лимита первые (старые) записи освобождаются из памяти.
  maxItems: number;
  // Сжимать кэш в gzip.
  compress: boolean;
  // Директория для файлов кэша (например ./cache)
  dir: string;
};

export type TCacheValidateOptions = {
  // Для валидации кэша по etag
  'if-none-match'?: string;
  // Для валидации кэша по дате создания
  'if-modified-since'?: string;
  // Для валидации кэша по maxAge (cacheAge)
  date?: Date;
};

export type TCache = {
  // Ключ кэша в виде хэшированной строки
  readonly key: string;
  // Дата создания кэша
  readonly time: number;
  // Признак ожидания рендера (процесс подготовки кэша)
  waiting: boolean;
  // Рендер html
  readonly html: string | Buffer;
  // Применялось ли сжатие html
  readonly compressed: boolean;
  // HTTP статус рендера (обычно 200 или 404)
  readonly status: number;
  // HTTP Location для редиректов
  readonly location: string | undefined;
  // Подпись кэша для определения валидности кэша в браузере/прокси/cdn
  readonly etag: string;
  // Срок кэша для его обновления в фоне
  readonly maxAge: number;
};

export interface ICacheStore {
  generateKey(values: (string | number | boolean)[]): string;

  get(key: string): Promise<TCache | undefined>;

  isValidSignature(key: string): Promise<boolean>;

  isValid(key: string, options: TCacheValidateOptions): Promise<boolean>;

  isWaiting(key: string, waitLimit: number): Promise<boolean>;

  waiting(key: string): Promise<void>;

  remove(key: string): Promise<void>;

  update(
    key: string,
    html: string,
    status: number,
    maxAge: number,
    location?: string,
  ): Promise<void>;

  onReady(key: string, callback: TCacheReadeCallback): void;
}

export type TCacheReadeCallback = (cache: TCache) => void;
