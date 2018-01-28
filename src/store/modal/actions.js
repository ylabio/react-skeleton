export const types = {
  OPEN: Symbol('OPEN'),
  CLOSE: Symbol('CLOSE'),
  SET_PROMISE: Symbol('SET_PROMISE')
};

export default {

  open: (name, params) => {
    return dispatch => {
      return new Promise(resolve => {
        dispatch({
          type: types.OPEN,
          payload: {name, params, resolve}
        });
      });
    };
  },

  close: (result) => {
    return async (dispatch, getState) => {
      const {modal} = getState();
      modal.resolve(result);
      dispatch({
        type: types.CLOSE,
        payload: {result}
      });
    };
  }
};
