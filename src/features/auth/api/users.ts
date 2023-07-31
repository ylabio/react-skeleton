import params from '@src/services/api/query-params';
import CRUDEndpoint from '@src/services/api/crud';
import {SignInBody} from "@src/features/auth/api/types";

class UsersEndpoint extends CRUDEndpoint {
  override defaultConfig() {
    return {
      ...super.defaultConfig(),
      url: '/api/v1/users',
    };
  }

  /**
   * Выбор одного юзера по токену (текущего авторизованного)
   * @return {Promise}
   */
  current({ fields = '*', ...other }) {
    return this.request({
      method: 'GET',
      url: `${this.config.url}/self`,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Авторизация
   * @param data
   * @param fields
   * @param other
   * @returns {Promise}
   */
  signIn({data, fields = '*', ...other}: {data: SignInBody, fields?: string}) {
    return this.request({
      method: 'POST',
      data: data,
      url: `${this.config.url}/sign`,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Выход
   * @returns {Promise}
   */
  signOut() {
    return this.request({
      method: 'DELETE',
      url: `${this.config.url}/sign`,
    });
  }
}

export default UsersEndpoint;
