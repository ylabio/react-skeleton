import reducer from "utils/reducer";
import {types} from "./actions.js";

const initState = {
  user: {},
  hasToken: null, // null, true, false

  loginWait: false,
  loginError: null,

  logoutWait: false,
  logoutError: null,

  remindWait: false,
  remindError: null,
};

export default reducer(initState, {

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
      user: action.payload.user,
      hasToken: true,
      loginWait: false,
      remindError: null
    };
  },

  [types.LOGIN_FAILURE]: (state, action) => {
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

  [types.LOGOUT_FAILURE]: (state, action) => {
    return {
      ...state,
      logoutWait: false,
      logoutError: action.error,
    };
  },

  [types.REMIND]: (state, action) => {
    return {
      ...state,
      remindWait: true,
      remindError: null
    };
  },

  [types.REMIND_SUCCESS]: (state, action) => {
    return {
      ...state,
      user: action.payload.user,
      hasToken: true,
      remindWait: false
    };
  },

  [types.REMIND_FAILURE]: (state, action) => {
    return {
      ...state,
      hasToken: false,
      remindWait: false,
      remindError: action.error,
    };
  },
});
