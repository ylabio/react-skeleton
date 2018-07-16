import * as api from '../../api';

export const types = {
  SAVE: Symbol('SAVE'),
  CLEAR: Symbol('CLEAR'),
};

const actions = {

  save: (data) => {
    return async dispatch => {
      localStorage.setItem('token', data.token);
      dispatch({type: types.SAVE, payload: data});
    };
  },

  clear: (logoutRequest = true) => {
    return async dispatch => {
      if (logoutRequest){
        await api.users.logout();
      }
      localStorage.removeItem('token');
      dispatch({type: types.CLEAR});
    };
  },

  // По токену восстановление информации об аккаунте
  remind: () => {
    return async dispatch => {
      const token = localStorage.getItem('token');
      if (token) {
        // Только для устоновки токена в http
        dispatch(actions.save({token, wait: true, exists: false}));
        try {
          const res = await api.users.current();
          dispatch(actions.save({token, user: res.data.result, wait: false, exists: true}));
        } catch (e) {
          dispatch(actions.clear(false));
          //throw e;
        }
      } else {
        dispatch(actions.clear(false));
      }
    };
  }
};

export default actions;
