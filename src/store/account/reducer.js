import {createReducer} from 'utils';
import { types } from './actions.js';


const initState = {
    profile: {}
};

export default createReducer(initState, {

    [types.AUTH_SUCCESS]: (state, action) => {
        return { ...state, profile: action.data };
    }

});
