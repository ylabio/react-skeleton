import mc from 'merge-change';
import exclude from "@src/utils/exclude";
import DataParamsState from "@src/services/store/data-params";
import {FindQuery} from "@src/services/api/crud/types";
import {
  TArticleData,
  TArticleParams
} from "@src/features/catalog/store/articles/types";
import {TDataParamsState} from "@src/services/store/data-params/types";

/**
 * Модуль товаров
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список товаров.
 */
class ArticlesState extends DataParamsState<TArticleData, TArticleParams> {

  override defaultState(): TDataParamsState<TArticleData, TArticleParams> {
    return mc.patch(super.defaultState(), {
      params: {
        category: ''
      },
    });
  }

  /**
   * Схема валидации восстановленных параметров
   */
  override schemaParams() {
    return mc.patch(super.schemaParams(), {
      properties: {
        sort: {enum: ['-date', 'date']},
        //category: {type: 'string'}, Категорию не надо сохранять, так как будет указываться страницей
      },
    });
  }

  /**
   * Параметры для сохранения в url search
   * @param params
   * @protected
   */
  protected override urlParams(params: TArticleParams): PartialDeep<TArticleParams> {
    // По умолчанию сохранялись бы все параметры
    return mc.merge(super.urlParams(params), {
      $unset: ['category'] //Категорию не надо сохранять, так как будет указываться страницей
    });
  }

  /**
   * Параметры для АПИ запроса
   * @param params Параметры состония
   */
  protected override apiParams(params: TArticleParams): FindQuery {
    const apiParams = mc.patch(super.apiParams(params), {
      fields: `items(*,category(title),madeIn(title)), count`,
      filter: {
        category: params.category
      }
    });
    return exclude(apiParams, {
      skip: 0,
      filter: {
        category: ''
      }
    });
  }

  /**
   * Загрузка данных
   * @param apiParams Параметры АПИ запроса
   */
  protected override async loadData(apiParams: FindQuery): Promise<TArticleData> {
    const response = await this.services.api.endpoints.articles.findMany(apiParams);
    // Установка полученных данных в состояние
    return response.data.result;
  }
}

export default ArticlesState;
