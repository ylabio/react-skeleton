import mc from 'merge-change';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Services from '@src/services';
import ApiService from '.';
import { IApiConfig } from '@src/typings/config';

export interface IEndpoint {
  services: Services;
  api: ApiService;
  config: IApiConfig;
}

/**
 * Базовый (абстрактный) класс точки доступа к АПИ
 */
abstract class Endpoint {
  services: Services;
  api: ApiService;
  config: IApiConfig;

  constructor(config: IApiConfig, services: Services) {
    this.services = services;
    this.api = this.services.api;
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Конфигурация по умолчанию
   * Переопределяется общими параметрами сервиса api и параметрами из конфига экземпляра
   * @return {Object}
   */
  defaultConfig(): IApiConfig {
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
  request(options: AxiosRequestConfig): Promise<AxiosResponse<any, any>> {
    // Учитываются опции модуля и переданные в аргументах
    return this.api.axios.request(mc.merge(this.config, options));
  }
}

export default Endpoint;
