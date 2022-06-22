import params from '@src/utils/query-params';
import Endpoint from '@src/services/api/endpoint';

interface BaseQuery {
  fields?: string;
  limit?: number;
  skip?: number;
}

class CRUDEndpoint extends Endpoint {
  /**
   * Выбор списка
   * @param search {Object} Параметры поиска
   * @param fields {String} Какие поля выбирать
   * @param limit {Number} Количество
   * @param skip {Number} Сдвиг выборки от 0
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  findMany({
    filter,
    fields = 'items(*),count',
    limit = 20,
    skip = 0,
    ...other
  }: BaseQuery & { filter: string }) {
    return this.request({
      method: 'GET',
      url: this.config.url,
      params: params({ search: filter, fields, limit, skip, ...other }),
    });
  }

  /**
   * Выбор одного
   * @param id {String} Идентификатор ресурса
   * @param fields {String} Какие поля выбирать
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  findOne({ id, fields = '*', ...other }: BaseQuery & { id: string }) {
    return this.request({
      method: 'GET',
      url: `${this.config.url}/${id}`,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Создание ресурса
   * @param data {Object} Свойства ресурса
   * @param fields {String} Какие поля выбирать в ответ
   * @param path {String} Путь в url
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  create({ data, fields = '*', ...other }: BaseQuery & { data: any }) {
    return this.request({
      method: 'POST',
      url: `${this.config.url}`,
      data,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Изменение ресурса
   * @param id {String} Идентификатор ресурса
   * @param data {Object}изменяемые свойства ресурса
   * @param fields {String} Какие поля выбирать в ответ
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  update({ id, data, fields = '*', ...other }: BaseQuery & { id: string, data: any }) {
    return this.request({
      method: 'PATCH',
      url: `${this.config.url}/${id}`,
      data,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Удаление ресурса
   * @param id {String} Идентификатор ресурса
   * @param fields {String} Какие поля выбирать
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  delete({ id, fields = '*', ...other }: { id: string, fields: string }) {
    return this.request({
      method: 'DELETE',
      url: `${this.config.url}/${id}`,
      params: params({ fields, ...other }),
    });
  }
}

export default CRUDEndpoint;
