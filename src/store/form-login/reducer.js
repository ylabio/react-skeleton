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
      errors: null,
      wait: true
    };
  },

  [types.SUBMIT_SUCCESS]: (state) => {
    return {
      ...state,
      data: {...initState.data},
      errors: null,
    };
  },

  [types.SUBMIT_FAILURE]: (state, action) => {
    console.log(action.errors);
    return {
      ...state,
      errors: action.errors,
      wait: false,
    };
  },

});
