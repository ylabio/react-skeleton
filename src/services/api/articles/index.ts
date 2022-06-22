import CRUDEndpoint from '@src/services/api/crud';
import mc from 'merge-change';

class ArticlesEndpoint extends CRUDEndpoint {
  defaultConfig() {
    return mc.patch(super.defaultConfig(), {
      url: '/api/v1/articles',
    });
  }
}

export default ArticlesEndpoint;
