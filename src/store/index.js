import { combineReducers, createStore } from 'redux';
// import thunkMiddleware from 'redux-thunk';
import * as reducers from './reducers';
//import createLogger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = {
  configure: preloadedState => {
    const composeEnhancers = composeWithDevTools({
      serialize: true,
    });
    Object.assign(
      store,
      createStore(
        combineReducers(reducers),
        preloadedState,
        //composeEnhancers(applyMiddleware(/*thunkMiddleware /*, loggerMiddleware*/)),
      ),
    );
  },
  /**
   * Assign from store instance after init()
   */
  dispatch: action => {},
  subscribe: listener => {},
  getState: () => {},
  /**
   * Custom methods
   */
  // dispatchStart: (type, payload) => {
  //   store.dispatch({type, payload, START: true});
  // },
  // dispatchSuccess: (type, payload) => {
  //   store.dispatch({type, payload, SUCCESS: true});
  // },
  // dispatchFail: (type, error, payload) => {
  //   store.dispatch({type, error, payload, FAIL: true});
  // },
};

export default store;
