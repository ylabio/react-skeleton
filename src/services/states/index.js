import { combineReducers, createStore } from 'redux';
//import * as reducers from '@src/store/reducers';
import mc from 'merge-change';
import * as states from './export.js';
import reducerSimple from "@src/utils/reducer-simple";

class StatesService {
  init(config, services) {
    this.config = config;
    this.services = services;
    this.states = {};
    this.reducers = { };
    this.createStore();
    return this;
  }

  createStore(){
    // Редьсеры для действий
    const names = Object.keys(states);
    for (const name of names){
      this.createState(name);
    }
    this._store = createStore(
      combineReducers(this.reducers),
      this.config.preloadedState,
      //composeEnhancers(applyMiddleware(/*thunkMiddleware /*, loggerMiddleware*/)),
    );
  }

  createState(name, refreshStore = false){
    const config = mc.merge(this.config[name], {name});
    const constructor = states[name] || states[this.config.defaultName];
    this.states[name] = new constructor(config, this.services);
    this.reducers[name] = reducerSimple(name, this.states[name].defaultState());
    console.log(this.reducers);
    if (refreshStore){
      this._store.replaceReducer(combineReducers(this.reducers));
    }
  }

  get store() {
    return this._store;
  }

  /**
   *
   * @param action
   * @returns {*}
   */
  dispatch(action) {
    return this._store.dispatch(action);
  }

  /**
   * Текущее состояние в redux store
   * @returns {EmptyObject & S}
   */
  getState() {
    return this._store.getState();
  }

  /**
   * Установка редьюсеров
   * @see npm merge-change
   * @param reducers {Object<Function>} Объект с функциями-редьюсерами
   */
  patchReducers(reducers) {
    this.reducers = mc.patch(this.reducers, reducers);
    this._store.replaceReducer(combineReducers(this.reducers));
  }

  /**
   * Доступ к состоянию
   * Если состояния ещё нет, то будет создано
   * @param name
   * @return {*}
   */
  get(name){
    if (!this.states[name]){
      this.createState(name, true);
    }
    return this.states[name];
  }

  get categories(){
    return this.get('categories');
  }

  get articles(){
    return this.get('articles');
  }

  get modals(){
    return this.get('modals');
  }

  get session(){
    return this.get('session');
  }

  get formLogin(){
    return this.get('formLogin');
  }
}

export default StatesService;
