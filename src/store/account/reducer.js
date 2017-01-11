import {createReducer} from "utils";
import {types} from "./actions.js";


const initState = {

};

export default createReducer(initState, {

    [types.INIT]: (state, action) => {
        return {
            ...state,
        }
    }
});