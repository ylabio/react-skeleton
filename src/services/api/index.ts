import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {TServices} from '@src/services/types';
import Service from "@src/services/service";
import * as endpoints from './export';
import {
  TApiConfig,
  TEndpoints, TEndpointsNames,
} from './types';

/**
 * Сервис HTTP API (REST API) к внешнему серверу
 * Обертка над библиотекой axios для осуществления http запросов
 * Позволяет разнести слой АПИ на модули (endpoints)
 */
class ApiService extends Service<TApiConfig, undefined> {
  private _endpoints: TEndpoints;
  private _axios: AxiosInstance;

  constructor(config: TApiConfig, services: TServices) {
    super(config, services);
    this._endpoints = {} as TEndpoints;
    this._axios = axios.create(this.config.default);
  }

  init() {
    // Создание экземпляров endpoint
    const names = Object.keys(endpoints) as TEndpointsNames[];
    for (const name of names) this.initEndpoint(name);
  }

  /**
   * Инициализация модуля endpoint
   * @param name Имя модуля API, по которому будет обращение к методам
   * @param moduleName Название JS модуля. По умолчанию равен name
   */
  initEndpoint<T extends keyof TEndpoints>(name: T, moduleName?: T) {
    const config = this.config.endpoints[name];
    // Если нет класса сопоставленного с name, то используется класс по умолчанию
    if (!moduleName) moduleName = name;
    if (!endpoints[moduleName]) throw new Error(`Not found endpoint module "${moduleName}"`);
    const Constructor = endpoints[moduleName];
    this._endpoints[name] = new Constructor(config, this.services, name) as TEndpoints[T];
    this._endpoints[name].init();
  }

  /**
   * Экземпляр Axios для выполнения HTTP запросов
   */
  get axios() {
    return this._axios;
  }

  /**
   * Установка общего заголовка для всех endpoints
   * @param name Название заголовка
   * @param value Значение заголовка
   */
  setHeader(name: string, value?: string) {
    if (value) {
      this.axios.defaults.headers[name] = value;
    } else if (name in this.axios.defaults.headers) {
      delete this.axios.defaults.headers[name];
    }
  }

  /**
   * Запрос
   */
  request(options: AxiosRequestConfig) {
    // Учитываются опции модуля и переданные в аргументах
    return this.axios.request(options);
  }

  get endpoints() {
    return this._endpoints;
  }

  /**
   * Endpoint по названию
   * @param name Название модуля endpoint
   */
  get<T extends TEndpointsNames>(name: T): TEndpoints[T] {
    if (!this._endpoints[name]) {
      throw new Error(`Not found endpoint "${name}"`);
    }
    return this._endpoints[name];
  }
}

export default ApiService;
