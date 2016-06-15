import Account from '../../api/Account.js';

export const types = {
    AUTH: Symbol('AUTH'),
    AUTH_SUCCESS: Symbol('AUTH_SUCCESS'),
    AUTH_FAIL: Symbol('AUTH_FAIL')
};

export default {

    /**
     * Авторизация (получение текузего аккаунта)
     * @returns {Function}
     */
    auth: () => {
        return dispatch => {
            dispatch({type: types.AUTH});
            return Account.current()
                .then(response => {
                    dispatch({type: types.AUTH_SUCCESS, data: response.data});
                })
                .catch(response => {
                    dispatch({type: types.AUTH_FAIL, data: response.data});
                });
        }
    },

};
