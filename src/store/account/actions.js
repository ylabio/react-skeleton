import Account from '../../api/Account.js';

export const types = {
  LOGIN: Symbol('LOGIN'),
  LOGIN_SUCCESS: Symbol('LOGIN_SUCCESS'),
  LOGIN_FAILURE: Symbol('LOGIN_FAILURE'),

  LOGOUT: Symbol('LOGOUT'),
  LOGOUT_SUCCESS: Symbol('LOGOUT_SUCCESS'),
  LOGOUT_FAILURE: Symbol('LOGOUT_FAILURE'),

  REMIND: Symbol('REMIND'),
  REMIND_SUCCESS: Symbol('REMIND_SUCCESS'),
  REMIND_FAILURE: Symbol('REMIND_FAILURE')
};

export default {

  login: (email, password, remember) => {
    return async dispatch => {
      dispatch({type: types.LOGIN});

      try {
        const response = await Account.login(email, password, remember);
        const {result} = response.data;
        dispatch({type: types.LOGIN_SUCCESS, payload: result});
        return result;
      } catch (e) {
        if (e.response && e.response.status < 500) {
          dispatch({type: types.LOGIN_FAILURE, error: e.response.data.error});
        } else {
          throw e;
        }
      }
    };
  },

  logout: () => {
    return async dispatch => {
      dispatch({type: types.LOGOUT});

      try {
        const res = await Account.logout();
        dispatch({type: types.LOGOUT_SUCCESS});
      } catch (e) {
        if (e.response && e.response.status < 500) {
          dispatch({type: types.LOGOUT_FAILURE, error: e.response.data.error});
        } else {
          throw e;
        }
      }
    };
  },

  // Авторизация по куке
  remind: () => {
    return async dispatch => {
      dispatch({type: types.REMIND});
      try {
        const res = await Account.current();
        dispatch({type: types.REMIND_SUCCESS, payload: res.data.result});
      } catch (e) {
        if (e.response && e.response.status < 500) {
          dispatch({type: types.REMIND_FAILURE, error: e.response.data.error});
        } else {
          throw e;
        }
      }
    };
  },

};
