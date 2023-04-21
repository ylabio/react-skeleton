import params from '@src/utils/query-params';
import CRUDEndpoint from '@src/services/api/crud';
import mc from 'merge-change';

class UsersEndpoint extends CRUDEndpoint {
  defaultConfig() {
    return mc.patch(super.defaultConfig(), {
      url: '/api/v1/users',
    });
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
   * @param login
   * @param password
   * @param remember
   * @param fields
   * @param other
   * @returns {Promise}
   */
  login({
    login,
    password,
    remember = false,
    fields = '*',
    ...other
  }: {
    login: string,
    password: string,
    remember: boolean,
    fields: string,
  }) {
    return this.request({
      method: 'POST',
      data: { login, password, remember },
      url: `${this.config.url}/sign`,
      params: params({ fields, ...other }),
    });
  }

  /**
   * Выход
   * @returns {Promise}
   */
  logout() {
    return this.request({
      method: 'DELETE',
      url: `${this.config.url}/sign`,
    });
  }

  registration({ profile = {}, ...rest }) {
    return this.request({
      method: 'POST',
      data: { profile, ...rest },
      url: `${this.config.url}`,
    });
  }

  resetPassword({ login }: { login: string }) {
    return this.request({
      method: 'POST',
      data: { login },
      url: `${this.config.url}/password`,
    });
  }
}

export default UsersEndpoint;
