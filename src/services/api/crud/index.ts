import params from '../query-params';
import Endpoint from '../endpoint';
import {DataQuery, FindQuery, GetQuery} from "@src/services/api/crud/types";

class CRUDEndpoint extends Endpoint {
  /**
   * Выбор списка
   * @param search Параметры поиска
   * @param fields Какие поля выбирать
   * @param limit Количество
   * @param skip Сдвиг выборки от 0
   * @param other  Другие параметры апи
   */
  findMany({
    filter,
    fields = 'items(*),count',
    limit = 20,
    skip = 0,
    ...other
  }: FindQuery) {
    return this.request({
      method: 'GET',
      url: this.config.url,
      params: params({ search: filter, fields, limit, skip, ...other }),
    });
  }

  /**
   * Выбор одного
   * @param id Идентификатор ресурса
   * @param fields Какие поля выбирать
   * @param other Другие параметры апи
   */
  findOne({ id, fields = '*', ...other }: GetQuery) {
    return this.request({
      method: 'GET',
      url: `${this.config.url}/${id}`,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Создание ресурса
   * @param data Свойства ресурса
   * @param fields Какие поля выбирать в ответ
   * @param path Путь в url
   * @param other Другие параметры апи
   */
  create({ data, fields = '*', ...other }: DataQuery) {
    return this.request({
      method: 'POST',
      url: `${this.config.url}`,
      data,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Изменение ресурса
   * @param id Идентификатор ресурса
   * @param data Изменяемые свойства ресурса
   * @param fields Какие поля выбирать в ответ
   * @param other Другие параметры апи
   */
  update({ id, data, fields = '*', ...other }: DataQuery) {
    return this.request({
      method: 'PATCH',
      url: `${this.config.url}/${id}`,
      data,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Удаление ресурса
   * @param id Идентификатор ресурса
   * @param fields Какие поля выбирать
   * @param other Другие параметры апи
   */
  delete({ id, fields = '*', ...other }: GetQuery) {
    return this.request({
      method: 'DELETE',
      url: `${this.config.url}/${id}`,
      params: params({ fields, ...other }),
    });
  }
}

export default CRUDEndpoint;
