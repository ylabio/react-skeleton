import {createReducer} from "utils";
import {types} from "./actions.js";


const initState = {
    items: [],
    loading: false,
    updating: false
};

export default createReducer(initState, {

    /**
     * Инициализации сетки
     */
    [types.INIT]: (state, action) => {
        return {
            ...state,
            loading: true
        }
    },

    [types.INIT_SUCCESS]: (state, action) => {
        return {
            ...state,
            items: action.data,
            loading: false
        };
    },

    [types.INIT_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false
        }
    },

    /**
     * Обновение сетки
     */
    [types.UPDATE]: (state, action) => {
        return {
            ...state, 
            items: action.data, 
            updating: true
        };
    },
    
    [types.UPDATE_SUCCESS]: (state, action) => {
        return {
            ...state,
            updating: false
        };
    },
    
    [types.UPDATE_FAIL]: (state, action) => {
        return {
            ...state,
            updating: false
        };
    }
});