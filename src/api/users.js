import http from '../utils/http';

export default {
  /**
   * Signin
   * @param login
   * @param password
   * @param remember
   * @returns {Promise}
   */
  login: ({ login, password, remember = false }) => {
    // Mock request
    // return Promise.resolve({ data: { result: { user: { _id: 123 }, token: '123456' } } });

    return http.post(`/api/v1/users/sign`, { login, password, remember });
  },

  /**
   * Signout
   * @returns {Promise}
   */
  logout: () => {
    return http.delete(`/api/v1/users/sign`);
  },

  /**
   * @return {Promise}
   */
  current: () => {
    return http.get(`/api/v1/users/self`);
  },
};
