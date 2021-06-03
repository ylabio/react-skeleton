//import store from '@src/store';
import services from '@src/services';
//import * as api from '@src/api';
import listToTree from '@src/utils/list-to-tree';
import mc from 'merge-change';

export const types = {
  SET: Symbol('SET'),
};

/**
 * Начальное состояние
 * @type {Object}
 */
export const initState = {
  items: [],
  roots: [],
  wait: false,
  errors: null,
};

const actions = {
  /**
   * Сброс состояния к начальному
   */
  reset: () => {
    services.store.dispatch({ type: types.SET, payload: initState });
  },

  /**
   * Загрузка списка из апи
   * @param params Параметры запроса
   * @returns {Promise<*>}
   */
  load: async params => {
    services.store.dispatch({ type: types.SET, payload: { wait: true, errors: null } });
    try {
      const response = await services.api.endpoint('categories').getList(params);
      const result = response.data.result;
      services.store.dispatch({
        type: types.SET,
        payload: mc.patch(result, { roots: listToTree(result.items), wait: false, errors: null }),
      });
      return result;
    } catch (e) {
      if (e.response?.data?.error?.data) {
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

export default actions;
