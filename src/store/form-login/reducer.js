import reducer from '../../utils/reducer';
import {types} from './actions.js';

const initState = {
  data: {
    login: 'user1@example.com',
    password: 'string'
  },
  wait: false,
  errors: null,
};

export default reducer(initState, {

  [types.CHANGE]: (state, action) => {
    return {
      ...state,
      data: action.payload
    };
  },

  [types.SUBMIT]: (state) => {
    return {
      ...state,
      wait: true,
      errors: null,
    };
  },

  [types.SUBMIT_SUCCESS]: (state) => {
    return {
      ...state,
      data: {...initState.data},
      wait: false,
      errors: null,
    };
  },

  [types.SUBMIT_FAILURE]: (state, action) => {
    console.log(action.errors);
    return {
      ...state,
      wait: false,
      errors: action.errors,
    };
  },

});
