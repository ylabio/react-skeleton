import store from '@store';

export const types = {
  OPEN: Symbol('OPEN'),
  CLOSE: Symbol('CLOSE')
};

export default {
  open: async (name, params) => {
    return new Promise(resolve => {
      store.dispatch({
        type: types.OPEN,
        payload: {name, params, resolve},
      });
    });
  },

  close: async result => {
    const {modal} = store.getState();
    modal.resolve(result);
    store.dispatch({
      type: types.CLOSE,
      payload: {result},
    });
  },
};
