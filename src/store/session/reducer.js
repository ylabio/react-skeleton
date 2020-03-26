import reducer from '@utils/reducer';
import { types } from './actions.js';

const initState = {
  user: {},
  token: null, // Опционально, если используется в http.js
  wait: true,
  exists: false,
};

export default reducer(initState, {
  [types.SAVE]: (state, {payload}) => {
    return {
      ...state,
      exists: true,
      ...payload,
    };
  },

  [types.CLEAR]: state => {
    return {
      ...state,
      user: {},
      token: null,
      wait: false,
      exists: false,
    };
  },

  [types.REMIND]: state => {
    console.log('REMIND');
    return state;
  }
});
