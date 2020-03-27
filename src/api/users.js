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
    return api.get(`/api/v1/users`, {params: params({search, fields, limit, skip, ...other})});
  },

  /**
   * Выбор одного
   * @param id Идентификатор
   * @param fields Какие поля выбирать
   * @param other Другие параметры апи
   * @returns {Promise}
   */
  getOne: ({id, fields = '*', ...other}) => {
    return api.get(`/api/v1/users/${id}`, {params: params({fields, ...other})});
  },

  /**
   * Авторизация
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
   * Выход
   * @returns {Promise}
   */
  logout: () => {
    return api.delete(`/api/v1/users/sign`);
  },

  /**
   * Выбор одного юзера по токену (текущего авторизованного)
   * @return {Promise}
   */
  current: () => {
    return api.get(`/api/v1/users/self`);
  },
};
