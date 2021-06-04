import mc from "merge-change";
import BaseState from "@src/services/states/base";

class SessionState extends BaseState {

  defaultState() {
    return {
      user: {},
      token: null, // Опционально, если используется в http.js
      wait: true,
      exists: false,
    };
  }

  async clear(logoutRequest = true) {
    if (logoutRequest) {
      await this.services.api.endpoint('users').logout();
    }
    if (this.services.env.IS_WEB) {
      localStorage.removeItem('token');
    }
    this.resetState({wait: false});
    this.services.api.setToken(undefined);
  }

  /**
   * По токену восстановление информации об аккаунте
   * @return {Promise<void>}
   */
  async remind() {
    const token = this.services.env.IS_WEB ? localStorage.getItem('token') : undefined;
    if (token) {
      // Только для устоновки токена в http
      await this.save({token, wait: true, exists: false});
      try {
        const response = await this.services.api.endpoint('users').current({});

        await this.save({token, user: response.data.result, wait: false, exists: true});
      } catch (e) {
        await this.clear(false);
        throw e;
      }
    } else {
      await this.clear(false);
    }
  }

  async save(data) {
    if (this.services.env.IS_WEB) {
      localStorage.setItem('token', data.token);
    }
    this.updateState(mc.patch({exists: true}, data));
    this.services.api.setToken(data.token);
  }
}

export default SessionState;
