import Grid from '../../api/Grid.js';

export const types = {
    INIT: Symbol('INIT'),
    INIT_SUCCESS: Symbol('INIT_SUCCESS'),
    INIT_FAIL: Symbol('INIT_FAIL'),
    
    UPDATE: Symbol('UPDATE'),
    UPDATE_SUCCESS: Symbol('UPDATE_SUCCESS'),
    UPDATE_FAIL: Symbol('UPDATE_FAIL'),
};

export default {

    /**
     * Инициализация сетки
     * Состояние с сервера
     * @returns {Function}
     */
    init: () => {
        // return {
        //     type: types.INIT_SUCCESS,
        //     data: [
        //         [0, 0, 0, 0],
        //         [0, 0, 0, 0],
        //         [0, 0, 0, 0],
        //         [0, 0, 0, 0]
        //     ]};

        return dispatch => {
            dispatch({type: types.INIT});
            return Grid.load()
                .then(response => {
                    dispatch({type: types.INIT_SUCCESS, data: response.data});
                })
                .catch(response => {
                    dispatch({type: types.INIT_FAIL, data: response.data});
                });
        }
    },
    
    update: (items) => {
        // return {
        //     type: types.UPDATE,
        //     data: items
        // };

        return dispatch => {
            dispatch({type: types.UPDATE, data: items});
            return Grid.update(items)
                .then(response => {
                    dispatch({type: types.UPDATE_SUCCESS, data: response.data});
                })
                .catch(response => {
                    dispatch({type: types.UPDATE_FAIL, data: response.data});
                });
        }
    }
};