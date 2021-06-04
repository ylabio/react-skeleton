import mc from "merge-change";
import listToTree from "@src/utils/list-to-tree";
import BaseState from "@src/services/states/base";

class CategoriesState extends BaseState{

  defaultState() {
    return {
      items: [],
      roots: [],
      wait: false,
      errors: null,
    };
  }

  /**
   * Загрузка списка из апи
   * @param params Параметры запроса
   * @returns {Promise<*>}
   */
  async load(params) {
    this.updateState({wait: true, errors: null});
    try {
      const response = await this.services.api.endpoint('categories').getList(params);
      const result = response.data.result;
      this.updateState(mc.patch(result, {roots: listToTree(result.items), wait: false, errors: null}));
      return result;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        this.updateState({wait: false, errors: e.response.data.error.data.issues});
      } else {
        throw e;
      }
    }
  }
}

export default CategoriesState;
