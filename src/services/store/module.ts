import mc from 'merge-change';
import StoreService from '@src/services/store/index';

/**
 * Базовый класс модуля хранилища
 */
class StoreModule<Config = {}> {
  store: StoreService;
  services: any;
  config: { name: string } & Config;

  /**
   * @param config {Object} Конфиг модуля
   * @param services {Services}
   */
  constructor(config: any, services: any) {
    this.services = services;
    this.store = this.services.store;
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Конфигурация по умолчанию
   * @return {Object}
   */
  defaultConfig() {
    return {
      name: 'base', //поменяется сервисом при создании экземпляра
    };
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {};
  }

  /**
   * Текущее своё состояние
   * @return {*}
   */
  getState() {
    return this.store.getState()[this.config.name];
  }

  /**
   * Установка (замена) состояния
   * @param state {*}
   * @param description {String} Описание действия для логирования
   */
  setState(state: any, description = 'Установка') {
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
  updateState(update = {}, description = 'Обновление') {
    const state = mc.update(this.getState(), update);
    if (state !== this.getState()) {
      this.setState(state, description);
    }
  }

  /**
   * Сброс состояния в начальное с возможностью подмешать изменения
   * @param update {Object} Изменяемые свойства у начального состояния. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description {String} Описание действия для логирования
   */
  resetState(update = {}, description = 'Сброс') {
    this.setState(mc.update(this.initState(), update), description);
  }
}

export default StoreModule;
