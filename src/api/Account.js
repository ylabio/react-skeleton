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
    return Http.post(`/api/v1/users/sign`, {login, password, remember});
  },

  /**
   * Signout
   * @returns {Promise}
   */
  logout: () => {
    return Http.delete(`/api/v1/users/sign`);
  },

  /**
   * @return {Promise}
   */
  current: () => {
    return Http.get(`/api/v1/users/self`);
  }
};