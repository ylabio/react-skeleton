import mc from 'merge-change';
import allServices from './export';

const services: any = allServices;

class Services {
  list: any;
  configs: any;
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
  async init(configs: any) {
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
  get(name: string, params = {}) {
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
  get api() {
    return this.get('api');
  }

  /**
   * Сервис навигации
   * @returns {NavigationService}
   */
  get navigation() {
    return this.get('navigation');
  }

  /**
   * Сервис действий и состояния приложения
   * @returns {StoreService}
   */
  get store() {
    return this.get('store');
  }

  /**
   * Сервис рендера на сервере
   * @returns {SSRService}
   */
  get ssr() {
    return this.get('ssr');
  }

  /**
   * Сервис спецификаций
   * @returns {SpecService}
   */
  get spec() {
    return this.get('spec');
  }
}

export default Services;
