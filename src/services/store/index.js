import { combineReducers, createStore } from 'redux';
import * as reducers from '@src/store/reducers';
import mc from 'merge-change';

class StoreService {
  init(config, services) {
    this.config = config;
    this.services = services;
    this.reducers = { ...reducers };
    this._reduxStore = createStore(
      combineReducers(this.reducers),
      this.config.preloadedState,
      //composeEnhancers(applyMiddleware(/*thunkMiddleware /*, loggerMiddleware*/)),
    );
  }

  get reduxStore() {
    return this._reduxStore;
  }

  /**
   *
   * @param action
   * @returns {*}
   */
  dispatch(action) {
    return this._reduxStore.dispatch(action);
  }

  /**
   * Текущее состояние в redux store
   * @returns {EmptyObject & S}
   */
  getState() {
    return this._reduxStore.getState();
  }

  /**
   * Установка редьюсеров
   * @see npm merge-change
   * @param reducers {Object<Function>} Объект с функциями-редьюсерами
   */
  patchReducers(reducers) {
    this.reducers = mc.patch(this.reducers, reducers);
    this._reduxStore.replaceReducer(combineReducers(this.reducers));
  }
}

export default StoreService;
