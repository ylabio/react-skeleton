import mc from 'merge-change';
import allServices from './export';
import { INameServices, IServices, IServicesModules } from './types';

export const services: IServices = allServices;

class Services {
  list: IServicesModules;
  configs: any;
  classes: any;
  _env: any;
  proxy: IServicesModules;

  constructor() {
    this.configs = {};
    this.list = {} as IServicesModules;
    this.classes = {};
    this._env = process.env;
    const self = this;
    this.proxy = new Proxy (this.list, {
      get: <T extends keyof (IServicesModules)>(target: IServicesModules, key: T) => {
        console.log(key);
        return self.get(key);
      }
    })
  }

  /**
   * @param configs
   * @returns {Services}
   */
  async init(configs: any) {
    this.configure(configs);
    // Асинхронная загрузка классов сервисов
    let promises = [];
    const names = Object.keys(services) as INameServices[];
    for (const name of names) {
      promises.push(
        services[name]().then((module: any) => {
          this.classes[name] = module.default;
        }),
      );
    }
    await Promise.all(promises);

    // return this;
    return Promise.resolve(this.proxy);
  }

  /**
   * Подключение конфигураций
   * Объект конфигурации содержит ключи - названия сервисов, значение ключа - объект с опциями для соотв. сервиса
   * @param configs {Object|Array<Object>} Массив с объектами опций.
   * @returns {Services}
   */
  configure(configs: any) {
    if (!Array.isArray(configs)) configs = [configs];
    for (let i = 0; i < configs.length; i++) {
      this.configs = mc.merge(this.configs, configs[i]);
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
  get<T extends keyof IServicesModules>(name: T, params = {}): IServicesModules[T] {
    if (!this.list[name]) {
      if (!this.classes[name]) {
        console.log(this.list, this.classes, name);
        throw new Error(`Unknown service name "${name}"`);
      }
      const Constructor = this.classes[name];
      this.list[name] = new Constructor();
      this.list[name].init(mc.merge(this.configs[name], params), this.proxy);
    }
    return this.list[name];
  }

  // /**
  //  * Сервис навигации
  //  * @returns {NavigationService}
  //  */
  // get navigation() {
  //   return this.get('navigation');
  // }

  // /**
  //  * Сервис навигации
  //  * @returns {StoreService}
  //  */
  // get store() {
  //   return this.get('store');
  // }

}

export default Services;
