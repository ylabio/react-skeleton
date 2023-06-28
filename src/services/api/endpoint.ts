import mc from 'merge-change';
import { AxiosRequestConfig } from 'axios';
import {TServices} from '@src/services/types';
import {IApiService, TEndpointsNames} from "./types";

/**
 * Базовый (абстрактный) класс точки доступа к АПИ
 */
abstract class Endpoint<Config> {
  services: TServices;
  api: IApiService;
  config: Config;
  name: TEndpointsNames;

  constructor(config: Config | unknown, services: TServices, name: TEndpointsNames) {
    this.services = services;
    this.api = this.services.api;
    this.config = mc.patch(this.defaultConfig(), config);
    this.name = name;
  }

  /**
   * Инициализация после создания экземпляра.
   * Вызывается автоматически.
   * Используется, чтобы не переопределять конструктор
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(){}

  /**
   * Конфигурация по умолчанию.
   * Переопределяется общими параметрами сервиса api и параметрами из конфига экземпляра
   * @return {Object}
   */
  defaultConfig() {
    return {
      url: `/api/v1/${this.name}`,
      //baseURL: '',
      //headers: {},
      //auth:{} base auth
    };
  }

  /**
   * Запрос
   * @return {*}
   */
  request(options: AxiosRequestConfig) {
    // Учитываются опции модуля и переданные в аргументах
    return this.api.request(mc.merge(this.config, options));
  }
}

export default Endpoint;
