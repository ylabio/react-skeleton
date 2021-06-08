import mc from "merge-change";
import BaseState from "@src/services/store/base";
import services from '@src/services';

class SessionState extends BaseState {

  defaultState() {
    return {
      user: {},
      token: null, // Опционально, если используется в http.js
      wait: true,
      exists: false,
    };
  }

  async clear(logoutRequest = true, description = 'Сброс сессии') {
    if (logoutRequest) {
      await services.api.get('users').logout();
    }
    if (services.env.IS_WEB) {
      localStorage.removeItem('token');
    }
    this.resetState({wait: false}, description);
    services.api.setHeader(this.config.tokenHeader, undefined);
  }

  /**
   * По токену восстановление информации об аккаунте
   * @return {Promise<void>}
   */
  async remind() {
    const token = services.env.IS_WEB ? localStorage.getItem('token') : undefined;
    if (token) {
      // Только для установки токена в http
      await this.save({token, wait: true, exists: false}, 'Установка токена из localStore');
      try {
        const response = await services.api.get('users').current({});
        await this.save({token, user: response.data.result, wait: false, exists: true}, 'Установка данных сессии от сервера');
      } catch (e) {
        await this.clear(false, 'Сброс сессии из-за ответа сервера');
        throw e;
      }
    } else {
      await this.clear(false, 'Сброс сессии из-за отсутствия токена');
    }
  }

  async save(data, description = 'Установка сессии') {
    if (services.env.IS_WEB) {
      localStorage.setItem('token', data.token);
    }
    this.updateState(mc.patch({exists: true}, data), description);
    services.api.setHeader(this.config.tokenHeader, data.token);
  }
}

export default SessionState;
