import {createReducer} from "utils";
import {types} from "./actions.js";


const initState = {
  user: {},
  token: null,
  loginWait: false,
  loginError: null,
  logoutWait: false,
  logoutError: null,
  accountWait: false,
  accountError: null,
};

export default createReducer(initState, {

  [types.INIT]: (state, action) => {
    return {
      ...state,
    };
  },

  [types.LOGIN]: (state, action) => {
    return {
      ...state,
      loginWait: true,
      loginError: null
    };
  },

  [types.LOGIN_SUCCESS]: (state, action) => {
    return {
      ...state,
      user: action.user,
      token: true,
      loginWait: false,
      accountError: null
    };
  },

  [types.LOGIN_FAIL]: (state, action) => {
    return {
      ...state,
      loginWait: false,
      loginError: action.error,
    };
  },

  [types.LOGOUT]: (state, action) => {
    return {
      ...state,
      logoutWait: true,
      logoutError: null
    };
  },

  [types.LOGOUT_SUCCESS]: (state, action) => {
    return {
      ...state,
      user: {},
      token: false,
      logoutWait: false
    };
  },

  [types.LOGOUT_FAIL]: (state, action) => {
    return {
      ...state,
      logoutWait: false,
      logoutError: action.error ? action.error.message : 'Ошибка сервера',
    };
  },

  [types.ACCOUNT]: (state, action) => {
    return {
      ...state,
      accountWait: true,
      accountError: null
    };
  },

  [types.ACCOUNT_SUCCESS]: (state, action) => {
    return {
      ...state,
      user: action.data.user,
      token: action.data.token,
      accountWait: false
    };
  },

  [types.ACCOUNT_FAIL]: (state, action) => {
    return {
      ...state,
      token: false,
      accountWait: false,
      accountError: action.error ? action.error.message : 'Ошибка сервера',
    };
  },

});