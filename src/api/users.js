import api from '@api';
import queryParams from "@utils/query-params";

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
    return api.post(`/api/v1/users/sign`, { login, password, remember });
  },

  /**
   * Signout
   * @returns {Promise}
   */
  logout: () => {
    return api.delete(`/api/v1/users/sign`);
  },

  /**
   * @return {Promise}
   */
  current: () => {
    return api.get(`/api/v1/users/self`);
  },

  /**
   * Выбор списка
   * @param search
   * @param fields
   * @param limit
   * @param skip
   * @returns {Promise}
   */
  getList: ({search, fields = '*', limit = 20, skip = 0}) => {
    return api.get(`/api/v1/articles`, {params: queryParams({search, fields, limit, skip})});
  },

  /**
   * Выбор одного
   * @param id
   * @param fields
   * @param limit
   * @param skip
   * @returns {Promise}
   */
  getOne: ({id, fields = '*', limit = 20, skip = 0}) => {
    return api.get(`/api/v1/articles/${id}`, {params: queryParams({fields, limit, skip})});
  },
};
