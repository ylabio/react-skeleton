import * as modules from './exports';
import mc from 'merge-change';
import Services from '..';

export type IModules = typeof modules

export type IStoreModules = {
  [P in keyof IModules]: InstanceType<IModules[P]>
}

export type IRootState = {
  [P in keyof IStoreModules]: ReturnType<IStoreModules[P]['initState']>
}

export type INameModules = keyof IModules;

export interface IDefaultConfig {
  name: INameModules;
  proto?: INameModules;
  disabled?: boolean
}

/**
 * Хранилище состояния приложения
 */
class StoreService {
  state: IRootState;
  private listeners: any[];
  private modules: IStoreModules;
  public services: Services;
  private config: any;


  constructor() {
    this.services = {} as Services;
    // Состояние приложения (данные всех модулей)
    this.state = {} as IRootState;
    // Подписчики на изменение state
    this.listeners = [];
    // Модули
    this.modules = {} as IStoreModules;
  }

  init(config: any, services: Services) {
    this.services = services;
    this.config = config;
    const names = Object.keys(modules) as INameModules[];
    for (const name of names) {
      this.initModule({ name });
    }
    return this;
  }

  /**
   * Инициализация модуля хранилища
   * @param config
   */
  initModule(config: IDefaultConfig) {
    if (!config.name) throw new Error('Undefined store module name ');
    config = mc.merge(this.config.states[config.name], config);
    if (config.disabled !== true) {
      // Если нет класса сопоставленного с name, то используется класс по умолчанию
      if (!config.proto) config.proto = config.name;
      if (!modules[config.proto]) throw new Error(`Not found store module "${config.name}"`);
      const constructor = modules[config.proto];

      // Экземпляр модуля
      this.modules[config.name] = new constructor(config, this.services);
      // Состояние по умочланию от модуля
      if (!this.state[config.name]) {
        this.state[config.name] = this.modules[config.name].initState();
      }
    }
  }

  /**
   * Подписка на изменение state
   * @param callback {Function}
   */
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    // Возвращаем функцию для отписки
    return () => {
      this.listeners = this.listeners.filter((item: any) => item !== callback);
    };
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState(): IRootState {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   * @param [description]
   */
  setState(newState: IRootState, description = 'Устанока') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.state);
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.groupEnd();
    }

    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const lister of this.listeners) {
      lister(this.state);
    }
  }

  /**
   * Доступ к модулю состояния
   * @param name {String} Название модуля
   * @return {StoreModule}
   */
  get<T extends keyof IStoreModules>(name: T): IStoreModules[T] {
    return this.modules[name];
  }

  /**
   * @return {ArticlesState}
   */
  get articles() {
    return this.get('articles');
  }
}

export default StoreService;
