import Account from '../../api/Account.js';

export const types = {
    LOGIN: Symbol('LOGIN'),
    LOGIN_SUCCESS: Symbol('LOGIN_SUCCESS'),
    LOGIN_FAIL: Symbol('LOGIN_FAIL'),

    LOGOUT: Symbol('LOGOUT'),
    LOGOUT_SUCCESS: Symbol('LOGOUT_SUCCESS'),
    LOGOUT_FAIL: Symbol('LOGOUT_FAIL'),

    ACCOUNT: Symbol('ACCOUNT'),
    ACCOUNT_SUCCESS: Symbol('ACCOUNT_SUCCESS'),
    ACCOUNT_FAIL: Symbol('ACCOUNT_FAIL'),
};

export default {

    login: (login, password, remember, onSuccess) => {
        return async dispatch => {
            dispatch({ type: types.LOGIN });
            
            try {
                const res = await Account.login(login, password, remember);
                dispatch({ type: types.LOGIN_SUCCESS, user: res.data });
                onSuccess(res);
            } catch (res) {
                let error = 'Ошибка авторизации';
                if (res.response.status == 404) {
                    error = 'Неверные логин или пароль';
                }
                dispatch({type: types.LOGIN_FAIL, error});
            }
        }
    },

    logout: () => {
        return async dispatch => {
            dispatch({type: types.LOGOUT});

            try {
                const res = await Account.logout();
                dispatch({type: types.LOGOUT_SUCCESS});
            } catch (res) {
                dispatch({type: types.LOGOUT_FAIL, error: res.response.data});
            }
        }
    },

    account: () => {
        return async dispatch => {
            dispatch({type: types.ACCOUNT});

            try {
                const res = await Account.account();
                dispatch({type: types.ACCOUNT_SUCCESS, data: res.data});
            } catch (res) {
                dispatch({type: types.ACCOUNT_FAIL, error: res.response.data});
            }
        }
    },

};