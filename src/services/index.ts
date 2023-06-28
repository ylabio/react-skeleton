import mc from 'merge-change';
import allServices from './export';
import {
  TServicesNames,
  TServicesImports,
  TServicesConstructors,
  TServices,
  TServiceConfig
} from './types';

export const services: TServicesImports = allServices;

class Services {
  private list: TServices;
  private configs: TServiceConfig;
  private classes: TServicesConstructors;
  private proxy: TServices;
  private initialState: Map<TServicesNames, unknown>;

  constructor() {
    this.configs = {} as TServiceConfig;
    this.list = {} as TServices;
    this.classes = {} as TServicesConstructors;
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
  async init(configs: TServiceConfig | TServiceConfig[]) {
    this.configure(configs);
    // Подготовка начального состояния сервисов, если оно есть
    await this.initInitialState();
    // Асинхронная загрузка классов сервисов
    const promises = [];
    const names = Object.keys(services) as TServicesNames[];
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
  configure(configs: TServiceConfig | TServiceConfig[]) {
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
        console.log(this.list, this.classes, name);
        throw new Error(`Unknown service name "${name}"`);
      }
      const Constructor = this.classes[name];
      this.list[name] = new Constructor(mc.merge(this.configs[name], params), this.proxy) as TServices[T];
      this.list[name].init(this.initialState.get(name));
    }
    return this.list[name];
  }

  /**
   * Загрузка начального состояния для сервисов.
   * Вызывается автоматом при инициализации менеджера сервисов
   */
  private async initInitialState() {
    if (this.hasInitialState()) {
      const response = await fetch(`/ssr/state/${window.initialKey}`);
      const json = await response.json();
      for (const [key, value] of Object.entries(json)){
        this.initialState.set(key as TServicesNames, value);
      }
    }
  }

  /**
   * Имеется ли начальное состояние для сервисов?
   * Начальное состояние может быть при серверном рендере, обычно передаётся ключ состояния
   */
  hasInitialState() {
    return !import.meta.env.SSR && window.initialKey;
  }

  /**
   * Сбор состояния с каждого сервиса, у которых есть метод dump
   * Обычно используется на сервере после рендера, чтобы передать состояние клиенту
   */
  collectDump() {
    const result = {} as { [index: string]: unknown };
    const names = Object.keys(this.list) as TServicesNames[];
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
