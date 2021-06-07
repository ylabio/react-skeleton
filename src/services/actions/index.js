import {combineReducers, createStore, compose, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import mc from 'merge-change';
import reducerSimple from "@src/utils/reducer-simple";
import * as modules from './export.js';

class ActionsService {
  init(config) {
    this.config = config;
    this.actions = {};
    this.reducers = {};
    this.createStore();
    return this;
  }

  /**
   * Создание redux store с модулями состояния
   */
  createStore() {
    // Инициализация типовых редьюсеров и экземпляров действий на ними
    const names = Object.keys(modules);
    for (const name of names) {
      this.initActions(name);
    }
    this._store = createStore(
      combineReducers(this.reducers),
      this.config.preloadedState,
      this.createMiddlewares(),
    );
  }

  /**
   * Создание типового модуля состояния (редьюсер + экземпляр класса действий)
   * @param name {String} Название модуля
   * @param [refreshStore] {Boolean} Обновить redux store (если он уже был сознан)
   */
  initActions(name, refreshStore = false) {
    const config = mc.merge(this.config[name], {name});
    // Если нет класса сопоставленного с name, то используется класс по умолчанию
    const constructor = modules[name] || modules[this.config.defaultName];
    this.actions[name] = new constructor(config);
    this.reducers[name] = reducerSimple(name, this.actions[name].defaultState());
    if (refreshStore && this._store) {
      this._store.replaceReducer(combineReducers(this.reducers));
    }
  }

  /**
   * Создание промежуточных обработчиков (перед вызовом редьюсеров)
   */
  createMiddlewares() {
    let middlewares = [];
    if (this.config.log) middlewares.push(this.createLogger());
    //...
    return middlewares.length ? compose(applyMiddleware(...middlewares)) : undefined;
  }

  /**
   * Создание обработка логов действий
   */
  createLogger() {
    // Логгер с кастомным заголовком для вывода описания действия
    return createLogger({
      titleFormatter: (action, time, took) => `action: ${action.type} @ ${time} (in ${took.toFixed(2)} ms) // ${action.description || ''}`
    });
  }

  get store() {
    return this._store;
  }

  /**
   * Доступ к состоянию
   * Если состояния ещё нет, то будет создано
   * @param name
   * @return {*}
   */
  get(name) {
    if (!this.actions[name]) {
      this.initActions(name, true);
    }
    return this.actions[name];
  }

  // Вспомогательные свойства для доступа к модулям состояния вместо метода get()

  /**
   * @return {CategoriesState}
   */
  get categories() {
    return this.get('categories');
  }

  /**
   * @return {ArticlesState}
   */
  get articles() {
    return this.get('articles');
  }

  /**
   * @return {ModalsState}
   */
  get modals() {
    return this.get('modals');
  }

  /**
   * @return {SessionState}
   */
  get session() {
    return this.get('session');
  }

  /**
   * @return {FormLoginState}
   */
  get formLogin() {
    return this.get('formLogin');
  }
}

export default ActionsService;
