import mc from 'merge-change';
import StoreService from '@src/services/store/index';
import {TStoreModuleKey, TStoreModuleName} from './types';
import { TServices } from '../types';

/**
 * Базовый класс модуля хранилища
 */
class StoreModule<Config> {
  store: StoreService;
  services: TServices;
  config: Config;
  name: TStoreModuleKey<TStoreModuleName>;

  /**
   * @param config Конфиг модуля
   * @param services Менеджер сервисов
   * @param name Название модуля
   */
  constructor(config: Config | unknown, services: TServices, name: TStoreModuleKey<TStoreModuleName>) {
    this.services = services;
    this.store = this.services.store;
    this.name = name;
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Инициализация после создания экземпляра.
   * Вызывается автоматически.
   * Используется, чтобы не переопределять конструктор
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(){}

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(): Config | object {
    return {};
  }

  /**
   * Начальное состояние
   */
  defaultState() {
    return {};
  }

  /**
   * Текущее своё состояние
   */
  getState() {
    return this.store.getState()[this.name];
  }

  /**
   * Установка (замена) состояния
   * @param state Новое состояние модуля
   * @param description Описание действия для логирования
   */
  setState(state: any, description = 'Установка') {
    this.store.setState(
      {
        ...this.store.getState(),
        [this.name]: state,
      },
      description,
    );
  }

  /**
   * Обновление состояния
   * @param update Изменяемые свойства. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param [description] Описание действия для логирования
   */
  updateState(update = {}, description = 'Обновление') {
    const state = mc.update(this.getState(), update);
    if (state !== this.getState()) {
      this.setState(state, description);
    }
  }

  /**
   * Сброс состояния в начальное с возможностью подмешать изменения
   * @param update Изменяемые свойства у начального состояния. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description Описание действия для логирования
   */
  resetState(update = {}, description = 'Сброс') {
    this.setState(mc.update(this.defaultState(), update), description);
  }
}

export default StoreModule;
