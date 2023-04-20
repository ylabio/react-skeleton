import CRUDEndpoint from '@src/services/api/crud';
import mc from "merge-change";

class CategoriesEndpoint extends CRUDEndpoint{

  defaultConfig() {
    return mc.patch(super.defaultConfig(), {
      url: '/api/v1/categories',
    });
  }
}

export default CategoriesEndpoint;
