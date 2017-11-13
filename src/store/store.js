import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from './reducers';
//import createLogger from 'redux-logger'

export default createStore(
  combineReducers(reducers),
  undefined,
  applyMiddleware(thunkMiddleware/*, loggerMiddleware*/)
);
