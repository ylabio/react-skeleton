import type { ServerOptions } from 'http-proxy';

export type ProxyOptions = {
  // Включить прокси на сервере рендара
  enabled: boolean;
  // Пути перенаправления запросов.
  routes: {
    [path: string]: ServerOptions;
  };
};
