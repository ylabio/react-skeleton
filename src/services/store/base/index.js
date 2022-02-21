import mc from "merge-change";

class BaseState {

  constructor(config, services) {
    this.services = services;
    this.store = this.services.store;
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Конфигурация по умолчанию
   * @return {Object}
   */
  defaultConfig(){
    return {
      name: 'base' //поменяется сервисом при создании экземпляра
    };
  }

  /**
   * Начальные данные для состояния
   * @return {{}}
   */
  defaultState() {
    return {};
  }

  /**
   * Текущее состояние
   * @return {*}
   */
  currentState() {
    return this.store.redux.getState()[this.config.name];
  }

  /**
   * Обновление состояния
   * @param update {Object} Изменяемые свойства. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description {String} Описание действия для логирования
   */
  updateState(update = {}, description = 'Обновление') {
    this.store.redux.dispatch({
      type: this.config.name,
      payload: mc.update(this.currentState(), update),
      description
    });
  }

  /**
   * Сброс состояния в начальное с возможностью подмешать изменения
   * @param update {Object} Изменяемые свойства начального состояния. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description {String} Описание действия для логирования
   */
  resetState(update = {}, description = 'Сброс') {
    this.store.redux.dispatch({
      type: this.config.name,
      payload: mc.update(this.defaultState(), update),
      description
    });
  }
}

export default BaseState;
