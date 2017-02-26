import Rest from '../utils/Rest.js';

export default{
    /**
     * Signin
     * @param login
     * @param password
     * @param remember
     * @returns {Promise}
     */
    login: (login, password, remember = false) => {
        return Rest.post(`/api/auth/web`, {login, password, remember});
    },

    /**
     * Signout
     * @returns {Promise}
     */
    logout: () => {
        return Rest.delete(`/api/auth?full=false`);
    },

    /**
     * Authorization
     * @returns {Promise}
     */
    account: () => {
        return Rest.get(`/api/account`);
    },
}