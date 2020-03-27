import api from '@api';
import params from "@utils/query-params";

export default {
  /**
   * Выбор списка
   * @param search Параметры поиска
   * @param fields Какие поля выбирать
   * @param limit Количество
   * @param skip Сдвиг выборки от 0
   * @param other Другие параметры апи
   * @returns {Promise}
   */
  getList: ({search, fields = '*', limit = 20, skip = 0, ...other}) => {
    return api.get(`/api/v1/categories`, {params: params({search, fields, limit, skip, ...other})});
  },

  /**
   * Выбор одного
   * @param id Идентификатор
   * @param fields Какие поля выбирать
   * @param other Другие параметры апи
   * @returns {Promise}
   */
  getOne: ({id, fields = '*', ...other}) => {
    return api.get(`/api/v1/categories/${id}`, {params: params({fields, ...other})});
  },
};
