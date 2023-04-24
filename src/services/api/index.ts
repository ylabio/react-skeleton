import axios, {AxiosInstance, AxiosRequestConfig, HeadersDefaults} from 'axios';
import * as endpoints from './export';
import mc from 'merge-change';
import { IEndpointsModules, INameEndpoints } from './types';
import { IServicesModules } from '../types';


export interface IDefaultConfig {
  name: INameEndpoints;
  proto?: INameEndpoints;
  disabled?: boolean
}

/**
 * Сервис HTTP API (REST API) к внешнему серверу
 * Инкапсулиурет настройку библиотеки axios для осуществления http запросов
 * Позволяет декомпозировать работу с АПИ на модули (endpoints)
 */
class ApiService {
  config!: { default: AxiosRequestConfig, endpoints: IEndpointsModules };
  services: IServicesModules;
  _endpoints!: IEndpointsModules;
  _axios!: AxiosInstance;

  constructor() {
    this.services = {} as IServicesModules;
    this._endpoints = {} as IEndpointsModules;
  }

  async init(config: any, services: IServicesModules) {
    this.services = services;
    this.config = config;
    this._axios = axios.create(this.config.default);
    // Создание модулей endpoint
    const names = Object.keys(endpoints) as INameEndpoints[];
    for (const name of names) {
      this.createEndpoint({ name });
    }
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
  createEndpoint<T extends keyof IEndpointsModules>(config: {name: T}) {
    if (!config.name) throw new Error('Undefined endpoint name ');
    config = mc.merge(this.config.endpoints[config.name], config);
    // Если нет класса сопоставленного с name, то используется класс по умолчанию
    if (!endpoints[config.name]) throw new Error(`Not found base endpoint "${config.name}"`);
    const Constructor = endpoints[config.name];
    this._endpoints[config.name] = new Constructor(config, this.services) as IEndpointsModules[T];
    return this._endpoints[config.name];
  }

  /**
   * Экземпляр Axios для выполнения HTTP запросов
   * @return {AxiosInstance}
   */
  get axios() {
    return this._axios;
  }

  /**
   * Установка общего заголовка для всех endpoints
   * @param name {String} Название заголвока
   * @param value {*} Значение заголовка
   */
  setHeader(name: keyof HeadersDefaults, value: any) {
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
  request(options: any) {
    // Учитываются опции модуля и переданные в аргументах
    return this.axios.request(options);
  }

  //переназвать на endpoints
  get endpoints() {
    return this._endpoints;
  }

  /**
   * Endpoint по названию
   * @param name {String} Название модуля endpoint
   * @returns {BaseEndpoint}
   */
  get<T extends keyof IEndpointsModules>(name: T): IEndpointsModules[T] {
    if (!this._endpoints[name]) {
      throw new Error(`Not found endpoint "${name}"`);
    }
    return this._endpoints[name];
  }
}

export default ApiService;
