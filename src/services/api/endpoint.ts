import mc from 'merge-change';
import { AxiosRequestConfig } from 'axios';
import { IServicesModules } from '../types';

/**
 * Базовый (абстрактный) класс точки доступа к АПИ
 */
abstract class Endpoint {
  services: IServicesModules;
  api: any;
  config: any;

  constructor(config: any, services: IServicesModules) {
    this.services = services;
    this.api = this.services.api;
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Конфигурация по умолчанию
   * Переопределяется общими параметрами сервиса api и параметрами из конфига экземпляра
   * @return {Object}
   */
  defaultConfig() {
    return {
      url: '/api/v1/base',
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
    return this.api.axios.request(mc.merge(this.config, options));
  }
}

export default Endpoint;
