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
        return dispatch => {
            dispatch({type: types.LOGIN});

            Account.login(login, password, remember)
                .then(res => {
                    dispatch({type: types.LOGIN_SUCCESS, user: res.data});
                })
                .then(onSuccess)
                .catch((res) => {
                    let error = 'Ошибка авторизации';
                    if (res.response.status == 404) {
                        error = 'Неверные логин или пароль';
                    }
                    dispatch({type: types.LOGIN_FAIL, error});
                });
        }
    },

    logout: () => {
        return dispatch => {
            dispatch({type: types.LOGOUT});

            Account.logout()
                .then(res => {
                    dispatch({type: types.LOGOUT_SUCCESS});
                })
                .catch((res) => {
                    dispatch({type: types.LOGOUT_FAIL, error: res.response.data});
                });
        }
    },

    account: () => {
        return dispatch => {
            dispatch({type: types.ACCOUNT});

            console.log('ddd');

            Account.account()
                .then(res => {
                    dispatch({type: types.ACCOUNT_SUCCESS, data: res.data});
                })
                .catch((res) => {
                    dispatch({type: types.ACCOUNT_FAIL, error: res.response.data});
                });
        }
    },

};