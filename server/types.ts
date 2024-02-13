import {Application} from "express";
import {ServerOptions} from "http-proxy";
import CacheStore, {TCacheConfig} from "./utils/cache-store";

export interface IServerConfig {
  server: {
    host: string,
    port: number,
  },
  proxy: {
    // Включить прокси на сервере рендара
    enabled: boolean
    // Пути перенаправления запросов.
    routes: {
      [path: string]: ServerOptions
    }
  },
  render: {
    // SSR или отдать SPA? Можно использовать для включения рендера только для поисковых ботов
    enabled: boolean,
    // Время ожидания рендера, если нет кэша. При таймауте или ошибках вернется SPA
    timeout: number
    // Параметры кэширования
    cache: TCacheConfig
  },

}

export interface IRouteContext {
  app: Application,
  cacheStore: CacheStore,
  config: IServerConfig,
  env: ImportMetaEnv
}
