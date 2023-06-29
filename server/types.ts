import {Application} from "express";
import InitialStore from "./utils/initial-store";
import {ServerOptions} from "http-proxy";

export interface IRouteContext {
  app: Application,
  initialStore: InitialStore,
  config: {
    PROD: boolean,
    DEV: boolean,
    server: {
      host: string,
      port: number,
    },
    proxy: {
      enabled: boolean
      routes: {
        [path: string]: ServerOptions
      }
    }
  }
}
