import axios, { Axios, AxiosInstance, AxiosRequestConfig, HeadersDefaults, RawAxiosResponseHeaders } from 'axios';
import { endpoints } from './export';
import mc from 'merge-change';
import { IEndpoint } from "@src/services/api/endpoint";
import Services from '@src/services';
import { EndpointsType, IApiConfig } from '@src/typings/config';

type EndpointType = typeof endpoints;

export type NameEndpointType = keyof EndpointType;

export type EndpointModulesType = {
  [P in keyof EndpointType]: InstanceType<EndpointType[P]>
}
type ModuleConfig = IApiConfig & { proto?: NameEndpointType, name: NameEndpointType }

export interface IApiService {
  config: ModuleConfig;
  services: Services;
  endpoints: EndpointsType<NameEndpointType>;
  _axios: AxiosInstance;
  createEndpoint(config: AxiosRequestConfig): void
  get(name: string): IEndpoint;
}


/**
 * Сервис HTTP API (REST API) к внешнему серверу
 * Инкапсулиурет настройку библиотеки axios для осуществления http запросов
 * Позволяет декомпозировать работу с АПИ на модули (endpoints)
 */
class ApiService implements IApiService {
  endpoints: EndpointsType<'crud' | 'ssr' | 'users' | 'articles' | 'categories'> = "crud";
  config!: ModuleConfig
  services!: Services;
  _axios!: AxiosInstance;

  async init(config: ModuleConfig, services: Services): Promise<ApiService> {
    this.services = services;
    this.config = config;
    this._axios = axios.create(this.config.default);
    // Object.entries(this.config.default).forEach(([name, value]) => {
    //   this.axios.defaults[name] = value;
    // });
    this.endpoints = {} as EndpointsType<NameEndpointType>;
    // Создание модулей endpoint
    console.log(this.endpoints)
    Object.entries(endpoints).forEach(([name]) => {
      const endpointName = name as NameEndpointType;
      this.createEndpoint({ name: endpointName });
    })
    return this;
  }

  /**
   * Инициализация модуля endpoint
   * Можно использовать для динамического создания модулей на базе существующего. Название базового передаётся в опции from
   * @param config
   *   name {String} Название модуля endpoint
   *   [proto] {String} Название базового модуля (класса endpoint) по умолчанию используется name
   *   ... другие опции, переопределяющие опции конфига
   * @return {BaseEndpoint}
   */
  createEndpoint(config: ModuleConfig): IEndpoint {
    if (!config.name) throw new Error('Undefined endpoint name ');
    config = mc.merge(this.config.endpoints?.[config.name], config);
    // Если нет класса сопоставленного с name, то используется класс по умолчанию
    if (!config.proto) config.proto = config.name;
    if (!endpoints[config.proto]) throw new Error(`Not found base endpoint "${config.name}"`);
    const Constructor = endpoints[config.proto];
    this.endpoints[config.name] = new Constructor(config, this.services);
    return this.endpoints[config.name];
  }

  /**
   * Экземпляр Axios для выполнения HTTP запросов
   * @return {AxiosInstance}
   */
  get axios(): Axios {
    return this._axios;
  }

  /**
   * Установка общего заголовка для всех endpoints
   * @param name {String} Название заголвока
   * @param value {*} Значение заголовка
   */
  setHeader(name: keyof HeadersDefaults, value?: Partial<RawAxiosResponseHeaders>) {
    if (value) {
      this.axios.defaults.headers[name] = value;
    } else if (name in this.axios.defaults.headers) {
      delete this.axios.defaults.headers[name];
    }
  }

  /**
   * Запрос
   * @return {*}
   */
  request(options: any): any {
    // Учитываются опции модуля и переданные в аргументах
    return this.axios.request(options);
  }

  /**
   * Endpoint по названию
   * @param name {String} Название модуля endpoint
   * @returns {BaseEndpoint}
   */
  get(name: NameEndpointType): any {
    if (!this.endpoints[name]) {
      throw new Error(`Not found endpoint "${name}"`);
    }
    return this.endpoints[name];
  }
}

export default ApiService;
