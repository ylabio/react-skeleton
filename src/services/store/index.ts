import * as modules from './exports';
import {
  TStoreNames,
  TStoreState,
  TStoreModules,
  TStoreListener,
  TStoreConfig,
} from './types';
import {TServices} from '@src/services/types';
import Service from "@src/services/service";

/**
 * Хранилище состояния приложения
 */
class StoreService extends Service<TStoreConfig, TStoreState> {
  private state: TStoreState;
  private listeners: TStoreListener[];
  private modules: TStoreModules;

  constructor(config: TStoreConfig | unknown, services: TServices) {
    super(config, services);
    // Состояние приложения (данные всех модулей)
    this.state = {} as TStoreState;
    // Подписчики на изменение state
    this.listeners = [];
    // Модули
    this.modules = {} as TStoreModules;
  }

  defaultConfig() {
    return {
      ...super.defaultConfig(),
      log: false,
      states: {}
    };
  }

  init(initialState?: unknown) {
    const names = Object.keys(modules) as TStoreNames[];
    for (const name of names) {
      this.initModule(name, name, initialState ? (initialState as TStoreState)[name] : undefined);
    }
  }

  /**
   * Инициализация модуля хранилища
   * @param name Имя модуля, по которому будет обращение к действиям и состоянию
   * @param moduleName Название JS модуля. По умолчанию равен name
   * @param initialState Предустановленное начальное состояние. Обычно использует для SSR
   */
  initModule<T extends keyof TStoreModules>(name: T, moduleName?: T, initialState?: TStoreState[T]) {
    const config = this.config.states;
    // Если нет класса сопоставленного с name, то используется класс по умолчанию
    if (!moduleName) moduleName = name;
    if (!modules[moduleName]) throw new Error(`Not found store module "${moduleName}"`);
    const constructor = modules[moduleName];
    // Экземпляр модуля
    this.modules[name] = new constructor(config[name], this.services, name) as TStoreModules[T];
    this.modules[name].init();
    // Состояние по умолчанию от модуля
    if (!this.state[name]) {
      this.state[name] = initialState || this.modules[name].initState();
    }
  }

  /**
   * Подписка на изменение state
   * @param callback Функция, которая будет вызываться после установки состояния
   */
  subscribe(callback: TStoreListener) {
    this.listeners.push(callback);
    // Возвращаем функцию для отписки
    return () => {
      this.listeners = this.listeners.filter((item: any) => item !== callback);
    };
  }

  /**
   * Всё состояние
   */
  getState(): TStoreState {
    return this.state;
  }

  /**
   * Установка state.
   * Необходимо учитывать иммутабельность.
   * @param newState Новое состояния всех модулей
   * @param [description] Описание действия для логирования
   */
  setState(newState: TStoreState, description = 'Установка') {
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
   * Доступ к модулям состояния
   */
  get actions() {
    return this.modules;
  }

  /**
   * Доступ к модулю состояния по названию
   * @param name  Название модуля
   */
  get<T extends keyof TStoreModules>(name: T): TStoreModules[T] {
    return this.modules[name];
  }

  dump(): TStoreState {
    return this.getState();
  }
}

export default StoreService;



