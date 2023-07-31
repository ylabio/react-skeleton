import mc from 'merge-change';
import ListParamsState from '@src/services/store/list-params';
import {TArticleItem, TArticleParams} from "@src/features/catalog/store/articles/types";
import {TListParamsState} from "@src/services/store/list-params/types";

/**
 * Модуль товаров
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список товаров.
 */
class ArticlesState extends ListParamsState<TArticleItem, TArticleParams> {

  override defaultState(): TListParamsState<TArticleItem, TArticleParams> {
    return mc.patch(super.defaultState(), {
      params: {
        fields: `items(*,category(title),madeIn(title)), count`,
        search: {
          category5: 6,
        }
      },
    });
  }

  /**
   * Описание используемых параметров в location (URL) после ?
   * Правила преобразования
   * @return {Object}
   */
  override schemaParams() {
    return mc.patch(super.schemaParams(), {
      properties: {
        sort: {enum: ['-date', 'date']},
        category: { type: 'string' },
      },
    });
  }

  /**
   * Загрузка данных
   * @param apiParams
   */
  override async load(apiParams: any): Promise<{items: TArticleItem[], count: number}> {
    const response = await this.services.api.endpoints.articles.findMany(apiParams);
    // Установка полученных данных в состояние
    return response.data.result;
  }
}

export default ArticlesState;
