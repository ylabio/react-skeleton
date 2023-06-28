import mc from 'merge-change';
import ListParamsState from '@src/services/store/list-params';

/**
 * Модуль товаров
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список товаров.
 */
class ArticlesState extends ListParamsState {

  initState() {
    return mc.patch(super.initState(), {
      params: {
        fields: `items(*,category(title),madeIn(title)), count`,
        filter: {
          category: undefined,
          $unset: ['query'], // параметр query не нужен от базового класса
        },
      },
    });
  }

  /**
   * Описание используемых параметров в location (URL) после ?
   * Правила преобразования
   * @return {Object}
   */
  schemaParams() {
    return mc.patch(super.schemaParams(), {
      properties: {
        sort: {enum: ['-date', 'date']},
        filter: {
          properties: {
            category: { type: 'string' },
            $unset: ['query'], // параметр query не нужен от базового класса
          },
        },
      },
    });
  }

  /**
   * Загрузка данных
   * @param apiParams
   */
  async load(apiParams: any) {
    const response = await this.services.api.endpoints.articles.findMany(apiParams);
    // Установка полученных данных в состояние
    return response.data.result;
  }
}

export default ArticlesState;
