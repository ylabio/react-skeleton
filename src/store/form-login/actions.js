//import store from '@src/store';
import services from '@src/services';
//import * as api from '@src/api';
import session from '@src/store/session/actions';
import initState, { types } from './state.js';

export default {
  /**
   * Изменение полей формы
   * @param data
   */
  change: data => {
    services.store.dispatch({
      type: types.SET,
      payload: { data },
    });
  },

  /**
   * Отправка формы в АПИ
   * @param data
   * @returns {Promise<*>}
   */
  submit: async data => {
    services.store.dispatch({ type: types.SET, payload: { wait: true, errors: null } });
    try {
      const response = await services.api.endpoint('users').login(data);
      const result = response.data.result;
      // Установка и сохранение сессии
      await session.save({ user: result.user, token: result.token });

      services.store.dispatch({ type: types.SET, payload: initState });
      return result;
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        services.store.dispatch({
          type: types.SET,
          payload: { wait: false, errors: e.response.data.error.data.issues },
        });
      } else {
        throw e;
      }
    }
  },
};
