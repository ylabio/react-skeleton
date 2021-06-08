import mc from "merge-change";
import CRUDListState from "@src/services/store/crud-list";

/**
 * Модуль товаров
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список товаров.
 */
class ArticlesState extends CRUDListState {

  defaultConfig(){
    return mc.patch(super.defaultConfig(), {
      apiEndpoint: 'articles' // Если endpoint не реализован, то, возможно, он создаётся динамически
    });
  }

  defaultState() {
    return mc.patch(super.defaultState(), {
      params: {
        fields: `items(*,category(title),maidIn(title)), count`,
        filter: {
          category: undefined,
          $unset: ['query'] // параметр query не нужен от базового класса
        }
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
            category: {type: 'string'},
            $unset: ['query'] // параметр query не нужен от базового класса
          },
        }
      }
    });
  }
}

export default ArticlesState;
