import {Http} from '../utils';

export default {
  /**
   * Signin
   * @param login
   * @param password
   * @param remember
   * @returns {Promise}
   */
  login: (login, password, remember = false) => {
    return Http.post(`/api/auth/web`, {login, password, remember});
  },

  /**
   * Signout
   * @returns {Promise}
   */
  logout: () => {
    return Http.delete(`/api/auth?full=false`);
  },

  /**
   * Authorization
   * @returns {Promise}
   */
  account: () => {
    return Http.get(`/api/account`);
  },
};