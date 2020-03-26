import reducer from '@utils/reducer';
import {types} from './actions.js';

const initState = {
  items: [],
  roots: [],
  wait: false,
  errors: null,
};

export default reducer(initState, {
  [types.RESET]: (state) => {
    return {...initState};
  },

  [types.LOAD]: (state, {payload}) => {
    return {
      ...state,
      ...payload,
    };
  },
});
