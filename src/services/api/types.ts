import * as endpoints from './imports';
import {Axios, AxiosRequestConfig, AxiosResponse} from "axios";

/**
 * Конструкторы модулей АПИ
 */
export type TEndpointsContructors = typeof endpoints;

/**
 * Названия модулей АПИ
 */
export type TEndpointsNames = keyof TEndpointsContructors;

/**
 * Модули АПИ
 */
export type TEndpoints = {
  [P in TEndpointsNames]: InstanceType<TEndpointsContructors[P]>
}

/**
 * Настройки сервиса АПИ и его модулей
 */
export type TApiConfig = {
  default: AxiosRequestConfig,
  // Настройки для конкретных модулей api по их названию
  endpoints: {
    [P in TEndpointsNames]?: ReturnType<TEndpoints[P]['defaultConfig']>
  }
}

/**
 * Интерфейс сервиса, чтобы указать его в модулях АПИ
 */
export interface IApiService {
  initEndpoint<T extends TEndpointsNames>(name: T, moduleName?: T):void;
  setHeader(name: string, value: any):void;
  request(options: AxiosRequestConfig):Promise<AxiosResponse>;
  endpoints: TEndpoints;
  axios: Axios;
}
