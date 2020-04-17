import reducer from '@utils/reducer';
import {types} from './actions.js';

const initState = {
  items: [],
  roots: [],
  wait: false,
  errors: null,
  changing: false,
  changingErrors: null,
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

  [types.CHANGE_TITLE]: (state, {payload}) => {
    const {id, title, wait, errors} = payload;

    if(!wait) {
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.title = title;
      }
    }

    return {
      ...state,
      changing: wait,
      changingErrors: errors,
    };
  },
});
