import reducer from '@utils/reducer';
import { types } from './actions.js';

const initState = {
  data: {
    login: 'test',
    password: '123456',
  },
  wait: false,
  errors: null,
};

export default reducer(initState, {
  [types.CHANGE]: (state, {payload}) => {
    return {
      ...state,
      data: payload,
    };
  },

  [types.SUBMIT_START]: (state) => {
    return {
      ...state,
      errors: null,
      wait: true,
    };
  },

  [types.SUBMIT_SUCCESS]: state => {
    return {
      ...state,
      data: { ...initState.data },
      errors: null,
      wait: false,
    };
  },

  [types.SUBMIT_FAILURE]: (state, {errors}) => {
    return {
      ...state,
      errors: errors,
      wait: false,
    };
  },
});
