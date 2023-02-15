import { IConfig } from '@src/typings/config';
import mc from 'merge-change';
import { services } from './export';
import StoreService from './store';
import ApiService from './api';

type RecordConfig = Record<string, IConfig>;

class Services {
  list: Partial<Record<keyof typeof services, any>>;
  configs: RecordConfig;
  _env: any;

  constructor() {
    this.configs = {};
    this.list = {};
    this._env = process.env;
  }

  /**
   * @param configs
   * @returns {Services}
   */
  init(configs: IConfig): Services {
    this.configure(configs);
    // Асинхронная загрузка классов сервисов
    return this;
  }

  /**
   * Подключение конфигураций
   * Объект конфигурации содержит ключи - названия сервисов, значение ключа - объект с опциями для соотв. сервиса
   * @param configs {Object|Array<Object>} Массив с объектами опций.
   * @returns {Services}
   */
  configure(configs: IConfig): Services {
    let arrConfigs: IConfig[] = [];
    if (!Array.isArray(configs)) {
      arrConfigs = [configs];
    }
    for (let i = 0; i < arrConfigs.length; i++) {
      this.configs = mc.merge(this.configs, arrConfigs[i]);
    }
    return this;
  }

  get env() {
    return this._env;
  }

  /**
   * Доступ к сервису по названию
   * Сервис создаётся в единственном экземпляре и при первом обращении инициализируется
   * @return {*}
   */
  get<T>(name: keyof typeof services, params = {}): T {
    if (!this.list[name]) {
      if (!services[name]) {
        console.log(this.list, services, name);
        throw new Error(`Unknown service name "${name}"`);
      }
      const Constructor = services[name];
      this.list[name] = new Constructor();
      let configName;
      
      if (this.list[name].configName && this.list[name]?.configName === 'function') {
        configName = this.list[name]?.configName();
      } else {
        configName = name;
      }
      this.list[name]?.init(mc.merge(this.configs[configName], params), this);
    }
    return this.list[name];
  }

  /**
   * Сервис API
   * @returns {ApiService}
   */
  get api(): ApiService {
    return this.get<ApiService>('api');
  }
  /**
   * Сервис действий и состояния приложения
   * @returns {StoreService}
   */
  get store(): StoreService {
    return this.get<StoreService>('store');
  }

}

export default Services;
