import CRUDEndpoint from '@src/services/api/crud';

class CategoriesEndpoint extends CRUDEndpoint{

  override defaultConfig() {
    return {
      ...super.defaultConfig(),
      url: '/api/v1/categories',
    };
  }
}

export default CategoriesEndpoint;
