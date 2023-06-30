import {Application} from "express";
import InitialStore from "./utils/initial-store";
import {ServerOptions} from "http-proxy";

export interface IServerConfig {
  PROD: boolean,
  DEV: boolean,
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
    // Рендер без ожидания асинхронного импорта и инициализации данных. Готовые фрагменты будут отдаваться в потоке частями.
    partial: boolean
  }
};

export interface IRouteContext {
  app: Application,
  initialStore: InitialStore,
  config: IServerConfig
}
