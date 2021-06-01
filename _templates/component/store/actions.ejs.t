---
to: src/store/<%= name %>/actions.js
---
import store from '@src/store';
import * as api from '@src/api';

export const types = {
  RESET: Symbol('RESET'),
  LOAD: Symbol('LOAD'),
};

export default {
  reset: () => {
    store.dispatch({ type: types.RESET });
  },

  load: async params => {
    store.dispatch({ type: types.LOAD, payload: { wait: true, errors: null } });
    try {
      const response = await api.<%= name %>.load(params);
      const result = response.data.result;
      store.dispatch({ type: types.LOAD, payload: { ...result, wait: false, errors: null } });
      return result;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        store.dispatch({
          type: types.LOAD,
          payload: { wait: false, errors: e.response.data.error.data.issues },
        });
      } else {
        throw e;
      }
    }
  },
};
