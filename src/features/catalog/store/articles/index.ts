import mc from 'merge-change';
import ListParamsState from '@src/features/catalog/store/list-params';
import { InitListParamsStateType } from '../list-params/types';

/**
 * Модуль товаров
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список товаров.
 */

interface IArticlesState {
  test: () => string;
}

class ArticlesState extends ListParamsState implements IArticlesState {
  defaultConfig() {
    return mc.patch(super.defaultConfig(), {
      apiEndpoint: 'articles', // Если endpoint не реализован, то, возможно, он создаётся динамически
    });
  }

  initState(): InitListParamsStateType {
    return mc.patch(super.initState(), {
      params: {
        fields: `items(*,category(title),maidIn(title)), count`,
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
        filter: {
          properties: {
            category: { type: 'string' },
            $unset: ['query'], // параметр query не нужен от базового класса
          },
        },
      },
    });
  }

  async findMany(params: any) {
    const response = await this.services.api.endpoints.articles.findMany(params);
    return response.data.result;
  }

  test() {
    return 'test';
  }
}

export default ArticlesState;
