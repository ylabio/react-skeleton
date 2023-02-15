import { modules } from './exports';
import mc from 'merge-change';
import Services from '@src/services';
import { IStoreConfig } from '@src/typings/config';
import ArticlesState from './articles';
import CategoriesState from './categories';
import ModalsState from './modals';
import SessionState from './session';
import FormLoginState from './form-login';

type ModulesType = typeof modules;
export type StoreModulesType = {
  [P in keyof ModulesType]: InstanceType<ModulesType[P]>
}
export type RootState = {
  [P in keyof StoreModulesType]: ReturnType<StoreModulesType[P]['initState']>;
}
export type NameType = keyof ModulesType;

export interface IDefaultConfig {
  name: NameType;
  proto?: NameType;
  disabled?: boolean
}
/**
 * Хранилище состояния приложения
 */
class StoreService {
  configName?: string; 
  state: RootState;
  listeners: ((state: RootState) => void)[];
  modules: StoreModulesType;
  services: Services;
  config: IStoreConfig;

  constructor() {
    this.config = {} as IStoreConfig;
    // Состояние приложения (данные всех модулей)
    this.state = {} as RootState;
    // Подписчики на изменение state
    this.listeners = [];
    // Модули
    this.modules = {} as StoreModulesType;
    // Сервисы
    this.services = {} as Services;
  }

  init(config: any, services: any) {
    this.services = services;
    this.config = config;
    const names = Object.keys(modules) as NameType[];
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
    if (!config.disabled) {
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
  getState() {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   * @param [description]
   */
  setState(newState: any, description = 'Устанока') {
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
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  /**
   * Доступ к модулю состояния
   * @param name {String} Название модуля
   * @return {StoreModule}
   */
  get<T extends keyof StoreModulesType>(name: T): StoreModulesType[T] {
    return this.modules[name];
  }

  /**
   * @return {ArticlesState}
   */
  get articles(): ArticlesState {
    return this.get<'articles'>('articles');
  }

  /**
   * @return {CategoriesState}
   */
  get categories(): CategoriesState {
    return this.get<'categories'>('categories');
  }

  /**
   * @return {ModalsState}
   */
  get modals(): ModalsState {
    return this.get('modals');
  }

  /**
   * @return {SessionState}
   */
  get session(): SessionState {
    return this.get('session');
  }

  /**
   * @return {FormLoginState}
   */
  get formLogin(): FormLoginState {
    return this.get('formLogin');
  }
}

export default StoreService;
