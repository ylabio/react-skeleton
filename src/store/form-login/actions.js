import store from '@store'
import * as api from '@api';
import * as actions from '../actions';

export const types = {
  CHANGE: Symbol('UPDATE'),
  SUBMIT_START: Symbol('SUBMIT_START'),
  SUBMIT_SUCCESS: Symbol('SUBMIT_SUCCESS'),
  SUBMIT_FAILURE: Symbol('SUBMIT_FAILURE'),
};

export default {

  change: data => {
    store.dispatch({
      type: types.CHANGE,
      payload: data,
    });
  },

  submit: async data => {

    store.dispatch({ type: types.SUBMIT_START });
    try {
      const response = await api.users.login(data);
      const result = response.data.result;
      // Установка и сохранение сессии
      await actions.session.save({ user: result.user, token: result.token });

      store.dispatch({ type: types.SUBMIT_SUCCESS, payload: result.user });
      return result;
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        store.dispatch({ type: types.SUBMIT_FAILURE, errors: e.response.data.error.data.issues });
      } else {
        throw e;
      }
    }
  },
};
