import api from '@api';
import queryParams from "@utils/query-params";

export default {
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
