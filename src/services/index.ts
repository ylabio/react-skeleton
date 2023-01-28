import { IConfig } from '@src/typings/config';
import mc from 'merge-change';
import ApiService from './api';
import allServices from './export';
import NavigationService from './navigation';
import SpecService from './spec';
import SSRService from './ssr';
import StoreService from './store';

const services: any = allServices;
type RecordConfig = Record<string, IConfig>;

class Services {
  list: any;
  configs: RecordConfig;
  classes: any;
  _env: any;

  constructor() {
    this.configs = {};
    this.list = {};
    this.classes = {};
    this._env = process.env;
  }

  /**
   * @param configs
   * @returns {Services}
   */
  async init(configs: IConfig): Promise<Services> {
    this.configure(configs);
    // Асинхронная загрузка классов сервисов
    let promises = [];
    const names = Object.keys(services);
    for (const name of names) {
      promises.push(
        services[name]().then((module: any) => {
          this.classes[name] = module.default;
        }),
      );
    }
    await Promise.all(promises);
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
  get<T>(name: string, params = {}): T {
    if (!this.list[name]) {
      if (!this.classes[name]) {
        console.log(this.list, this.classes, name);
        throw new Error(`Unknown service name "${name}"`);
      }
      const Constructor = this.classes[name];
      this.list[name] = new Constructor();
      let configName;
      if (this.list[name].configName === 'function') {
        configName = this.list[name].configName();
      } else {
        configName = name;
      }
      this.list[name].init(mc.merge(this.configs[configName], params), this);
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
   * Сервис навигации
   * @returns {NavigationService}
   */
  get navigation(): NavigationService {
    return this.get<NavigationService>('navigation');
  }

  /**
   * Сервис действий и состояния приложения
   * @returns {StoreService}
   */
  get store(): StoreService {
    return this.get<StoreService>('store');
  }

  /**
   * Сервис рендера на сервере
   * @returns {SSRService}
   */
  get ssr(): SSRService {
    return this.get<SSRService>('ssr');
  }

  /**
   * Сервис спецификаций
   * @returns {SpecService}
   */
  get spec(): SpecService {
    return this.get<SpecService>('spec');
  }
}

export default Services;
