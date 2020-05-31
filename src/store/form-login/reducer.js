import reducer from '@utils/reducer';
import { types, initState } from './actions.js';

export default reducer(initState, {
  [types.SET]: (state, { payload }) => {
    return {
      ...state,
      ...payload,
    };
  },

  [types.CHANGE]: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...initState.data,
        ...payload,
      },
    };
  },
});
