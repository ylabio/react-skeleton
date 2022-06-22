import axios, {AxiosInstance, AxiosRequestConfig, HeadersDefaults} from 'axios';
import * as allEndpoints from './export';
import mc from 'merge-change';
import {IEndpoint} from "@src/services/api/endpoint";

const endpoints: any = allEndpoints;

interface IApiService {
  config: { default: AxiosRequestConfig, endpoints: IEndpoint[] };
  services: any;
  endpoints: {[key: string]: IEndpoint};
  _axios: AxiosInstance;
  createEndpoint(config: AxiosRequestConfig) : void
  get(name: string): IEndpoint;
}

/**
 * Сервис HTTP API (REST API) к внешнему серверу
 * Инкапсулиурет настройку библиотеки axios для осуществления http запросов
 * Позволяет декомпозировать работу с АПИ на модули (endpoints)
 */
class ApiService implements IApiService {
  config!: { default: AxiosRequestConfig, endpoints: IEndpoint[] };
  services: any;
  endpoints!: {[key: string]: IEndpoint};
  _axios!: AxiosInstance;

  async init(config: IApiService['config'], services: IApiService['services']) {
    this.services = services;
    this.config = config;
    this._axios = axios.create(this.config.default);
    // Object.entries(this.config.default).forEach(([name, value]) => {
    //   this.axios.defaults[name] = value;
    // });
    this.endpoints = {};
    // Создание модулей endpoint
    Object.entries(endpoints).forEach(([name]) => this.createEndpoint({ name }));
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
  createEndpoint(config: any) {
    if (!config.name) throw new Error('Undefined endpoint name ');
    config = mc.merge(this.config.endpoints[config.name], config);
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

  /**
   * Endpoint по названию
   * @param name {String} Название модуля endpoint
   * @returns {BaseEndpoint}
   */
  get(name: string) {
    if (!this.endpoints[name]) {
      throw new Error(`Not found endpoint "${name}"`);
    }
    return this.endpoints[name];
  }
}

export default ApiService;
