import params from '@utils/query-params';

class Base{

  /**
   * @param http {AxiosInstance} Экземпляр библиотеки axios
   * @param path {String} Путь в url по умолчанию
   */
  constructor(http, path = 'base') {
    this.http = http;
    this.path = path;
  }

  /**
   * Выбор списка
   * @param search {Object} Параметры поиска
   * @param fields {String} Какие поля выбирать
   * @param limit {Number} Количество
   * @param skip {Number} Сдвиг выборки от 0
   * @param path {String} Путь в url
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  getList({ search, fields = 'items(*),count', limit = 20, skip = 0, path = undefined, ...other }){
    return this.http.get(`/api/v1/${path || this.path}`, {
      params: params({ search, fields, limit, skip, ...other }),
    });
  }

  /**
   * Выбор одного
   * @param id {String} Идентификатор ресурса
   * @param fields {String} Какие поля выбирать
   * @param path {String} Путь в url
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  getOne({ id, fields = '*', path = undefined, ...other }){
    return this.http.get(`/api/v1/${path || this.path}/${id}`, { params: params({ fields, ...other }) });
  }

  /**
   * Создание ресурса
   * @param data {Object} Свойства ресурса
   * @param fields {String} Какие поля выбирать в ответ
   * @param path {String} Путь в url
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  create({data, fields = '*', path = undefined, ...other }){
    return this.http.post(`/api/v1/${path || this.path}`, data, { params: params({ fields, ...other }) });
  }

  /**
   * Изменение ресурса
   * @param id {String} Идентификатор ресурса
   * @param data {Object}изменяемые свойства ресурса
   * @param fields {String} Какие поля выбирать в ответ
   * @param path {String} Путь в url
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  update({id, data, fields = '*', path = undefined, ...other }){
    return this.http.put(`/api/v1/${path || this.path}/${id}`, data, { params: params({ fields, ...other }) })
  }

  /**
   * Удаление ресурса
   * @param id {String} Идентификатор ресурса
   * @param fields {String} Какие поля выбирать
   * @param path {String} Путь в url
   * @param other {Object} Другие параметры апи
   * @returns {Promise}
   */
  delete({id, fields = '*', path = undefined, ...other }){
    return this.http.delete(`/api/v1/${path || this.path}/${id}`, { params: params({ fields, ...other }) });
  }
}

export default Base;
