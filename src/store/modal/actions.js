import store from '@store';

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
      store.dispatch({
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
    const state = store.getState().modal;
    if (state.resolve) {
      state.resolve(result);
    }
    store.dispatch({
      type: types.SET,
      payload: {
        show: false,
        result: result,
        resolve: null,
      },
    });
  },
};
