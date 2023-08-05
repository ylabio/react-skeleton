import mc from 'merge-change';
import {TServices} from '../types';
import {TStoreModuleKey, TStoreModuleName} from "@src/services/store/types";

/**
 * Базовый класс модуля состояния.
 * Реализует паттерн наблюдателя
 */
abstract class StoreModule<State, Config = object> {
  // Ссылка на сервисы
  protected readonly services: TServices;
  // Подписчики на изменение state
  protected readonly listeners: Set<() => void> = new Set();
  // Настройки
  protected readonly config: Config;
  // Название модуля
  protected readonly name: TStoreModuleKey<TStoreModuleName>;
  // Состояние (данные)
  protected state: State;

  /**
   * @param config Конфиг модуля
   * @param services Менеджер сервисов
   * @param env Переменные окружения
   * @param name Название модуля
   */
  constructor(
    config: PartialDeep<Config>,
    services: TServices,
    env: ImportMetaEnv,
    name: TStoreModuleKey<TStoreModuleName>,
  ) {
    this.services = services;
    this.config = mc.patch(this.defaultConfig(env), config);
    this.name = name;
    this.state = this.defaultState();
  }

  setS(v: State) {
    this.state = v;
  }

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(env?: ImportMetaEnv): Config {
    return {} as Config;
  }

  /**
   * Начальное состояние
   */
  defaultState(): State {
    return {} as State;
  }

  /**
   * Выбор состояние
   */
  getState = (): State => {
    return this.state;
  };

  /**
   * Установка state.
   * Необходимо учитывать иммутабельность.
   * @param newState Новое состояния всех модулей
   * @param [description] Описание действия для логирования
   */
  setState = (newState: State, description = 'Установка') => {
    if (this.services.store.config.log) {
      console.group(
        `%c${this.name} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.state);
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    this.notify();
  };

  /**
   * Обновление состояния
   * @param update Изменяемые свойства. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param [description] Описание действия для логирования
   */
  updateState = (update: Partial<State> | Patch<State>, description = 'Обновление') => {
    const state = mc.update(this.getState(), update);
    if (state !== this.getState()) {
      this.setState(state, description);
    }
  };

  /**
   * Сброс состояния в начальное с возможностью подмешать изменения
   * @param update Изменяемые свойства у начального состояния. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description Описание действия для логирования
   */
  resetState = (update: Partial<State> | Patch<State>, description = 'Сброс') => {
    this.setState(mc.update(this.defaultState(), update), description);
  };

  /**
   * Подписка на изменение state.
   * Возвращается функция для отписки
   * @param listener Функция, которая будет вызываться после установки состояния
   */
  subscribe = (listener: () => void): () => void => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Вызываем всех слушателей
   */
  protected notify = () => {
    this.listeners.forEach(listener => listener());
  };
}

export default StoreModule;
