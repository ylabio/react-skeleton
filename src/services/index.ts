import mc from 'merge-change';
import allServices from './imports';
import {
  TServiceName,
  TServicesImports,
  TServicesConstructors,
  TServices,
  TServicesConfig
} from './types';

export const services: TServicesImports = allServices;

class Services {
  private list: TServices;
  private configs: TServicesConfig;
  private classes: TServicesConstructors;
  private proxy: TServices;
  private initialState: Map<TServiceName, unknown>;
  private env: ImportMetaEnv;

  constructor(env : ImportMetaEnv) {
    this.configs = {} as TServicesConfig;
    this.list = {} as TServices;
    this.classes = {} as TServicesConstructors;
    this.env = env;
    this.initialState = new Map();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.proxy = new Proxy(this.list, {
      get: <T extends keyof (TServices)>(target: TServices, key: T) => {
        if (this.classes[key]) { // проверяем на классах, так list может быть пуст
          return self.get(key);
        } else {
          return target[key]; // Для доступа к служебным полям объекта
        }
      }
    });
  }

  /**
   * Инициализация менеджера, погрузка асинхронных сервисов
   * @todo Асинхронный импорт правильней бы сделать при доступе к сервису, но тогда обращение к сервису нужно выполнять с await
   * @param configs Общая конфигурация на все сервисы
   * @returns {Services} Возвращается прокси на доступ к сервисам по их названию
   */
  async init(configs: TServicesConfig | TServicesConfig[]) {
    this.configure(configs);
    // Подготовка начального состояния сервисов, если оно есть
    await this.initInitialState();
    // Асинхронная загрузка классов сервисов
    const promises = [];
    const names = Object.keys(services) as TServiceName[];
    for (const name of names) {
      promises.push(
        services[name]().then((module: any) => {
          this.classes[name] = module.default;
        }),
      );
    }
    await Promise.all(promises);
    return this.proxy;
  }

  /**
   * Подключение конфигураций
   * Объект конфигурации содержит ключи - названия сервисов, значение ключа - объект с опциями для соотв. сервиса
   * @param configs {Object|Array<Object>} Массив с объектами опций.
   * @returns {Services}
   */
  configure(configs: TServicesConfig | TServicesConfig[]) {
    if (!Array.isArray(configs)) configs = [configs];
    for (let i = 0; i < configs.length; i++) {
      this.configs = mc.merge(this.configs, configs[i]);
    }
    return this;
  }

  /**
   * Доступ к сервису по названию
   * Сервис создаётся в единственном экземпляре и при первом обращении инициализируется
   * @return {*}
   */
  get<T extends keyof TServices>(name: T, params = {}): TServices[T] {
    if (!this.list[name]) {
      if (!this.classes[name]) {
        throw new Error(`Unknown service name "${name}"`);
      }
      const Constructor = this.classes[name];
      this.list[name] = new Constructor(mc.merge(this.configs[name], params), this.proxy, this.env) as TServices[T];
      const dump = this.initialState.get(name);
      this.list[name].init(dump);
    }
    return this.list[name];
  }

  /**
   * Загрузка начального состояния для сервисов.
   * Вызывается автоматом при инициализации менеджера сервисов
   */
  private async initInitialState() {
    if (this.hasInitialState()) {
      const response = await fetch(`/initial/${window.initialKey}`);
      const json = await response.json();
      for (const [key, value] of Object.entries(json)){
        this.initialState.set(key as TServiceName, value);
      }
    }
  }

  /**
   * Имеется ли начальное состояние для сервисов?
   * Начальное состояние может быть при серверном рендере, обычно передаётся ключ состояния
   */
  hasInitialState() {
    return !this.env.SSR && window.initialKey;
  }

  /**
   * Сбор состояния с каждого сервиса, у которых есть метод dump
   * Обычно используется на сервере после рендера, чтобы передать состояние клиенту
   */
  collectDump() {
    const result = {} as { [index: string]: unknown };
    const names = Object.keys(this.list) as TServiceName[];
    for (const name of names) {
      const service = this.list[name];
      const data = service.dump();
      if (typeof data !== 'undefined') {
        result[name] = data;
      }
    }
    return result;
  }
}

export default Services;
