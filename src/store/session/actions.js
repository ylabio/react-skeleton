import store from '@store';
import apiService, * as api from '@api';

export const types = {
  SAVE: Symbol('SAVE'),
  CLEAR: Symbol('CLEAR'),
  REMIND: Symbol('REMIND')
};

const actions = {
  save: async data => {
    if (process.env.IS_WEB) {
      localStorage.setItem('token', data.token);
    }
    store.dispatch({type: types.SAVE, payload: data});
    apiService.setToken(data.token);
  },

  clear: async (logoutRequest = true) => {
    if (logoutRequest) {
      await api.users.logout();
    }
    if (process.env.IS_WEB) {
      localStorage.removeItem('token');
    }
    store.dispatch({type: types.CLEAR});
    apiService.setToken(undefined);
  },

  // По токену восстановление информации об аккаунте
  remind: async () => {
    const token = process.env.IS_WEB ? localStorage.getItem('token') : undefined;
    if (token) {
      // Только для устоновки токена в http
      await actions.save({token, wait: true, exists: false});
      try {
        const response = await api.users.current();
        await actions.save({token, user: response.data.result, wait: false, exists: true});
      } catch (e) {
        await actions.clear(false);
        //throw e;
      }
    } else {
      await actions.clear(false);
    }
  },
};

export default actions;
