import mc from 'merge-change';
import StoreService, { IDefaultConfig, RootState } from '@src/services/store/index';
import Services from '@src/services';
import { IStoreConfig } from '@src/typings/config';
import { InitStateType } from './list-params';

/**
 * Базовый класс модуля хранилища
 */
class StoreModule<Config = {}> {
  store: StoreService;
  services: Services;
  config: IDefaultConfig & Config;

  /**
   * @param config {Object} Конфиг модуля
   * @param services {Services}
   */
  constructor(config: IStoreConfig, services: Services) {
    this.services = services;
    this.store = this.services.store;
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Конфигурация по умолчанию
   * @return {Object}
   */
  defaultConfig(): IDefaultConfig {
    return {
      name: 'base', //поменяется сервисом при создании экземпляра
    };
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): InitStateType {
    return {};
  }

  /**
   * Текущее своё состояние
   * @return {*}
   */
  getState(): RootState {
    return this.store.getState()[this.config.name];
  }

  /**
   * Установка (замена) состояния
   * @param state {*}
   * @param description {String} Описание действия для логирования
   */
  setState(state: RootState, description: string = 'Установка'): void {
    this.store.setState(
      {
        ...this.store.getState(),
        [this.config.name]: state,
      },
      description,
    );
  }

  /**
   * Обновление состояния
   * @param update {Object} Изменяемые свойства. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description {String} Описание действия для логирования
   */
  updateState(update: RootState = {} as RootState, description: string = 'Обновление'): void{
    const state: RootState = mc.update(this.getState(), update);
    if (state !== this.getState()) {
      this.setState(state, description);
    }
  }

  /**
   * Сброс состояния в начальное с возможностью подмешать изменения
   * @param update {Object} Изменяемые свойства у начального состояния. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description {String} Описание действия для логирования
   */
  resetState(update: RootState = {} as RootState, description: string = 'Сброс'): void {
    this.setState(mc.update(this.initState(), update), description);
  }
}

export default StoreModule;
