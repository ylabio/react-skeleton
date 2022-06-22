import mc from 'merge-change';
import StoreModule from '@src/services/store/module';

class SessionState extends StoreModule<{ tokenHeader: string }> {
  initState() {
    return {
      user: {},
      token: null, // Опционально, если используется в http.js
      wait: true,
      exists: false,
    };
  }

  async clear(logoutRequest = true, description = 'Сброс сессии') {
    if (logoutRequest) {
      await this.services.api.get('users').logout();
    }
    if (this.services.env.IS_WEB) {
      localStorage.removeItem('token');
    }
    this.resetState({ wait: false }, description);
    this.services.api.setHeader(this.config.tokenHeader, undefined);
  }

  /**
   * По токену восстановление информации об аккаунте
   * @return {Promise<void>}
   */
  async remind() {
    const token = this.services.env.IS_WEB ? localStorage.getItem('token') : undefined;
    if (token) {
      // Только для установки токена в http
      await this.save({ token, wait: true, exists: false }, 'Установка токена из localStore');
      try {
        const response = await this.services.api.get('users').current({});
        await this.save(
          { token, user: response.data.result, wait: false, exists: true },
          'Установка данных сессии от сервера',
        );
      } catch (e) {
        await this.clear(false, 'Сброс сессии из-за ответа сервера');
        throw e;
      }
    } else {
      await this.clear(false, 'Сброс сессии из-за отсутствия токена');
    }
  }

  async save(data: any, description = 'Установка сессии') {
    if (this.services.env.IS_WEB) {
      localStorage.setItem('token', data.token);
    }
    this.updateState(mc.patch({ exists: true }, data), description);
    this.services.api.setHeader(this.config.tokenHeader, data.token);
  }
}

export default SessionState;
