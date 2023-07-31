import CRUDEndpoint from '@src/services/api/crud';

class ArticlesEndpoint extends CRUDEndpoint {
  override defaultConfig() {
    return {
      ...super.defaultConfig(),
      url: '/api/v1/articles',
    };
  }
}

export default ArticlesEndpoint;
