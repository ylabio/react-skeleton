import mc from 'merge-change';
import StoreModule from '@src/services/store/module';
import {SessionStateConfig} from "@src/services/store/session/types";

class SessionState extends StoreModule<SessionStateConfig> {
  initState() {
    return {
      user: {},
      token: null, // Опционально, если используется в http.js
      wait: true,
      exists: false,
    };
  }

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(): SessionStateConfig {
    return {
      tokenHeader: 'XToken',
    };
  }

  /**
   * Установка данных сессии
   * @param data Данные сессии
   * @param [description] Описание действия для логирования
   */
  async set(data: any, description = 'Установка сессии') {
    this.updateState(mc.patch({ exists: true }, data), description);
    // Запоминание токена для восстановления сессии
    if (!import.meta.env.SSR) localStorage.setItem('token', data.token);
    // Установка токена в АПИ
    this.services.api.setHeader(this.config.tokenHeader, data.token);
  }

  /**
   * Сброс сессии
   * @param logoutRequest Выполнять запрос на сервере для удаления токена?
   * @param [description] Описание действия для логирования
   */
  async clear(logoutRequest = true, description = 'Сброс сессии') {
    if (logoutRequest) {
      await this.services.api.endpoints.users.logout();
    }
    if (!import.meta.env.SSR) {
      localStorage.removeItem('token');
    }
    this.resetState({ wait: false }, description);
    this.services.api.setHeader(this.config.tokenHeader, undefined);
  }

  /**
   * Восстановление информации об аккаунте
   */
  async remind() {
    const token = !import.meta.env.SSR ? localStorage.getItem('token') : undefined;
    if (token) {
      // Только для установки токена в http
      await this.set({ token, wait: true, exists: false }, 'Установка токена из localStore');
      try {
        const response = await this.services.api.endpoints.users.current({});
        await this.set(
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


}

export default SessionState;
