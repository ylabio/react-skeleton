//import store from '@src/store';
import services from '@src/services';

export const types = {
  SET: Symbol('SET'),
};

export const initState = {
  show: false,
  name: null,
  params: null,
  result: null,
};

export default {
  open: async (name, params) => {
    return new Promise(resolve => {
      services.store.dispatch({
        type: types.SET,
        payload: {
          name,
          params,
          resolve,
          show: true,
          result: null,
        },
      });
    });
  },

  close: async result => {
    const state = services.store.getState().modal;
    if (state.resolve) {
      state.resolve(result);
    }
    services.store.dispatch({
      type: types.SET,
      payload: {
        show: false,
        result: result,
        resolve: null,
      },
    });
  },
};
