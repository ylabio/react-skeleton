import mc from "merge-change";
import services from '@src/services';

class BaseState {

  constructor(config) {
    this.config = config;
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
    return services.actions.store.getState()[this.config.name];
  }

  /**
   * Обновление состояния
   * @param update {Object} Изменяемые свойства. Может содержать операторы $set, $unset и др из https://www.npmjs.com/package/merge-change
   * @param description {String} Описание действия для логирования
   */
  updateState(update = {}, description = 'Обновление') {
    services.actions.store.dispatch({
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
    services.actions.store.dispatch({
      type: this.config.name,
      payload: mc.update(this.defaultState(), update),
      description
    });
  }
}

export default BaseState;
