import reducer from '@utils/reducer';
import { types } from './actions.js';

const initState = {
  show: false,
  name: null,
  params: null,
  result: null,
};

export default reducer(initState, {
  [types.OPEN]: (state, {payload}) => {
    return {
      ...state,
      show: true,
      name: payload.name,
      params: payload.params,
      resolve: payload.resolve,
      result: null,
    };
  },

  [types.CLOSE]: (state, {payload}) => {
    if (state.name) {
      return {
        ...state,
        show: false,
        result: payload.result,
        resolve: null,
      };
    } else {
      return state;
    }
  },
});
