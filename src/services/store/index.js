import {combineReducers, createStore, compose, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import mc from 'merge-change';
import * as modules from './export.js';

/**
 * Сервис управления состоянием на redux
 * Подмодулями реализуется вложенное именованное состояние и методы (действия) работы с ним
 */
class ActionsService {
  init(config) {
    this.config = config;
    this._states = {};
    this._reducers = {};
    this._redux = undefined;
    this.createStore();
    return this;
  }

  /**
   * Создание redux store с модулями состояния
   */
  createStore() {
    // Инициализация типовых редьюсеров и экземпляров действий на ними
    Object.entries(modules).forEach(([name]) => this.createState({name}, false));
    this.reviewPreloadState();
    // redux store
    this._redux = createStore(
      combineReducers(this._reducers),
      this.config.preloadedState,
      this.createMiddlewares(),
    );
  }

  /**
   * Создание типового модуля состояния (редьюсер + экземпляр класса действий)
   * @param config {Object} Конфигурация модуля
   *   name {String} Название модуля состояния
   *   [proto] {String} Название базового модуля (класса состояния) по умолчанию используется name
   *   ... другие опции, переопределяющие опции конфига
   * @param [refreshStore] {Boolean} Обновить redux store (если он уже был сознан)
   */
  createState(config, refreshStore = true) {
    if (!config.name) throw new Error('Undefined state name ');
    config = mc.merge(this.config.states[config.name], config);
    if (config.disabled !== true) {
      // Если нет класса сопоставленного с name, то используется класс по умолчанию
      if (!config.proto) config.proto = config.name;
      if (!modules[config.proto]) throw new Error(`Not found base state "${config.name}"`);
      const constructor = modules[config.proto];
      this._states[config.name] = new constructor(config);
      const initState = this._states[config.name].defaultState();
      this._reducers[config.name] = reducer(config.name, initState);
      if (refreshStore && this._redux) {
        this._redux.replaceReducer(combineReducers(this._reducers));
      }
    }
    return this._states[config.name];
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

  /**
   * Анализ предопределенного состояния.
   * На ключи состояния для которых нет ещё редьюсера создаётся редьсер по умолчанию
   * Необходимо для динамических моделей, которые ещё не инициализировать, а для них есть данные от SSR
   */
  reviewPreloadState(){
    if (this.config.preloadedState){
      const names = Object.keys(this.config.preloadedState);
      for (const name of names){
        if (!(name in this._reducers)){
          this._reducers[name] = reducer(name, this.config.preloadedState[name]);
        }
      }
    }
  }

  /**
   * Экземпляр хранилища redux
   * @return {Store}
   */
  get redux() {
    return this._redux;
  }

  /**
   * Доступ к состоянию
   * Если состояния ещё нет, то будет создано
   * @param name
   * @return {*}
   */
  get(name) {
    if (!this._states[name]) {
      throw new Error(`Not found state "${name}"`);
    }
    return this._states[name];
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

/**
 * Простой редьюсер для модуля состояния.
 * Срабатывает, если action.type соответствует названию редьсера
 * Единственное действие редьюсера - заменить состояние на action.payload
 * Немутабельное обновление должен выполнять метод, передающий action.payload
 * @example src/services/store/base/index.js BaseState.updateState()
 * @param name {String} Название редьсера
 * @param defaultState {Object} Начальное состояние
 * @return {Function}
 */
export function reducer(name, defaultState) {
  return (state = defaultState, action) => {
    if (action.type === name) {
      return action.payload;
    }
    return state;
  };
}

export default ActionsService;
