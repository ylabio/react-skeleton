import * as modules from './exports';
import Service from "@src/services/service";
import {IObservable} from "@src/utils/observable";
import {
  TStoreModuleName, TStoreModuleKey, TStoreState, TStoreModules, TStoreModulesConfig,
  TStoreListener, TStoreConfig
} from './types';

/**
 * Хранилище состояния приложения
 */
class StoreService extends Service<TStoreConfig, TStoreState> implements IObservable<TStoreState> {
  // Состояние приложения (данные всех модулей)
  private state: TStoreState = {} as TStoreState;
  // Подписчики на изменение state
  private listeners: TStoreListener[] = [];
  // Модули состояния
  readonly modules: TStoreModules = {} as TStoreModules;

  defaultConfig(): TStoreConfig {
    return {
      ...super.defaultConfig(),
      log: false,
      modules: {}
    };
  }

  /**
   * Инициализация сервиса
   * @param initialState Предустановленное начальное состояние. Обычно использует при SSR
   */
  init(initialState: Partial<TStoreState> = {}) {
    const names = Object.keys(modules) as TStoreModuleName[];
    for (const name of names) {
      this.initModule(name, name, undefined, initialState[name]);
    }
  }

  /**
   * Инициализация модуля хранилища, если его ещё нет в store.modules
   * @param name Название базового модуля.
   * @param key Ключ нового модуля, по которому будет обращение к действиям и состоянию. Должно начинаться с имени базового модуля.
   * @param config Настройки модуля. По умолчанию используются настройки базового модуля.
   * @param initialState Предустановленное начальное состояние модуля. Обычно используется после рендера на сервере.
   */
  initModule<Name extends TStoreModuleName>(
    name: Name,
    key: TStoreModuleKey<Name>,
    config?: TStoreModulesConfig[TStoreModuleKey<Name>],
    initialState?: TStoreState[TStoreModuleKey<Name>]
  ) {
    if (!this.modules[key]) {
      if (!modules[name]) throw new Error(`Not found store module "${name}"`);
      const stateConfig = config ? config : this.config.modules[key];
      const constructor = modules[name];
      // Экземпляр модуля
      this.modules[key] = new constructor(stateConfig, this.services, key) as TStoreModules[TStoreModuleKey<Name>];
      this.modules[key].init();
      // Состояние по умолчанию от модуля
      if (!this.state[key]) {
        this.state[key] = initialState || this.modules[key].defaultState();
      }
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
      this.listeners = this.listeners.filter(item => item !== callback);
    };
  }

  /**
   * Вызываем всех слушателей
   * @param state
   */
  notify(state: TStoreState) {
    for (const listener of this.listeners) listener(state);
  }

  get(): TStoreState {
    return this.state;
  }

  set(newState: TStoreState, description = 'Установка') {
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
    this.notify(this.state);
  }

  /**
   * Всё состояние
   */
  getState(): TStoreState {
    return this.get();
  }

  /**
   * Установка state.
   * Необходимо учитывать иммутабельность.
   * @param newState Новое состояния всех модулей
   * @param [description] Описание действия для логирования
   */
  setState(newState: TStoreState, description = 'Установка') {
    this.set(newState, description);
  }

  /**
   * Дамп текущего состояния.
   * Используется на сервере, чтобы передать состояние клиенту после SSR
   */
  dump(): TStoreState {
    return this.getState();
  }
}

export default StoreService;



