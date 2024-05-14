import { type Express } from 'express';
import { type ServerOptions } from 'http-proxy';
import { type Buffer } from 'node:buffer';

export interface IServerConfig {
  server: {
    host: string;
    port: number;
  };
  proxy: {
    // Включить прокси на сервере рендара
    enabled: boolean;
    // Пути перенаправления запросов.
    routes: {
      [path: string]: ServerOptions;
    };
  };
  render: {
    // SSR или отдать SPA?
    enabled: boolean;
    // Количество воркеров для рендера в фоне
    workers: number;
    // Параметры рендера и кэширования по отдельным адресам запроса
    rules: TRenderRuleConfig[];
    // Параметры кэширования
    cache: TCacheConfig;
  };
}

export type TRenderRuleConfig = {
  // Шаблон URL запроса, на которые распространяется опция
  url: string | string[];
  // Рендерить? Если рендер выключен или ещё не готов кэш страницы, то отдаётся SPA.
  // Если рендер уже выполняется в фоне, то повторной задачи на рендер не будет.
  // Если рендер включен и кэш готов, то вернется отрендеренная страница из кэша.
  // По умолчанию false
  ssr?: boolean;
  // Срок кэширования на сервере. Рендер в любом случаи кэшируется.
  // Обновление кэша происходит в фоне после запроса страницы, если срок кэша превысил cacheAge
  // По умолчанию 60
  cacheAge?: number;
  // Заголовок Cache-Control для браузера и прокси/cdn.
  // С max-age=0 (или без указания max-age) браузер сначала спросит у сервера валидность кэша (If-None-Match)
  // Если сервер вернёт 304 (без тела), то браузер применит свой кэш.
  // При этом браузер может хранить кэш сколько захочет долго.
  // С max-age>0 браузер может сразу воспользоваться своим кэшем даже если указан must-revalidate (но если его срок не превышен max-age).
  // s-maxage используется для кэширования на промежуточных серверах (прокси/CDN)
  // Чтобы браузер вообще не кэшировал нужно указать 'no-cache, no-store' (не использовать кэш сразу и не хранить его).
  // Параметр no-cache без no-store не запрещает кэширование браузеру, но применение кэша будет зависеть от ответа сервера (304). Вариант похожий с max-age=0.
  // Если рендер зависит от HTTP заголовков, то их нужно указать в vary через запятую.
  // Если рендер зависит от куки или некого состояния на сервере, то необходимо использовать вариант с max-age=0,
  // чтобы браузер всегда узнавал валидность кэша у сервера. Так как браузер не сможет корректно валидировать кэш.
  control?: string;
  // Какие HTTP заголовки учитывать при кэшировании. По умолчанию используется url без заголовков
  // Если нужно учитывать конкретную куку, то её лучше перенести в кастомный заголовок или в url
  // Заголовок Cookie не надо прописывать, так его значение скорее всего уникально для каждого клиента и серверу прийдется хранить отдельный кэш на каждого клиента
  vary?: string[];
  // HTTP статус при отдаче spa если отключен ssr
  // Можно сделать правило на несуществующие адреса, чтобы их не рендерить и отдавать spa в статусе 404
  spaHttpStatus?: number;
  // Ожидать рендер. По умолчанию false и рендер выполняется в фоне, а клиент отдаётся SPA версия
  // Параметр переопределяется заголовком "X-Ssr-wait: true", чтобы использовать его для прогрева кэша или генерации карты сайта
  ssrWait?: boolean;
  // Отправлять старый рендер вместо SPA (но с валидной подписью cache.signature)
  // Учитывается, если ssrWait = false
  // По умолчанию false
  ssrSendAged?: boolean;
};

export type TRenderRule = {
  patterns: URLPattern[];
  ssr: boolean;
  cacheAge: number;
  control: Map<string, string | number>;
  controlSrc: string;
  vary: string[];
  spaHttpStatus: number;
  ssrWait: boolean;
  ssrSendAged: boolean;
};

export interface IRouteContext {
  app: Express;
  cacheStore: ICacheStore;
  config: IServerConfig;
  env: ImportMetaEnv;
}

export type TSSRResponse = {
  status: number;
  headers: Record<string, string | number>;
  body: undefined | string | Buffer;
};

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
