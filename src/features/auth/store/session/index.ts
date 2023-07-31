import {ISessionState, ISessionStateConfig} from "@src/features/auth/store/session/types";
import {SignInBody} from "@src/features/auth/api/types";
import StoreModule from "@src/services/store/module";
import {ApiError} from "@src/services/api/types";

class SessionState extends StoreModule<ISessionState, ISessionStateConfig> {

  override defaultState(): ISessionState {
    return {
      user: null,
      token: null,
      waiting: true,
      errors: null,
      exists: false,
    };
  }

  /**
   * Конфигурация по умолчанию
   */
  override defaultConfig(env: ImportMetaEnv): ISessionStateConfig {
    return {
      tokenHeader: 'XToken',
      saveToLocalStorage: !env.SSR
    };
  }

  /**
   * Авторизация (вход)
   * @param data
   */
  async signIn(data: SignInBody) {
    this.setState(this.defaultState(), 'Авторизация');
    try {
      const res = await this.services.api.endpoints.users.signIn({data});
      this.setState({
        ...this.getState(),
        token: res.data.result.token,
        user: res.data.result.user,
        exists: true,
        waiting: false
      }, 'Успешная авторизация');

      if (this.config.saveToLocalStorage) {
        // Запоминаем токен, чтобы потом автоматически аутентифицировать юзера
        window.localStorage.setItem('token', res.data.result.token);
      }
      // Устанавливаем токен в АПИ
      this.services.api.setHeader(this.config.tokenHeader, res.data.result.token);
      return true;
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.response?.data?.error) {
          this.setState({
            ...this.getState(),
            errors: this.simplifyErrors(e.response.data.error.data.issues),
            waiting: false
          }, 'Ошибка авторизации');
        }
      } else {
        console.error(e);
      }
    }
    return false;
  }

  /**
   * Отмена авторизации (выход)
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await this.services.api.endpoints.users.signOut();
      // Удаляем токен
      if (this.config.saveToLocalStorage) {
        window.localStorage.removeItem('token');
      }
      // Удаляем заголовок
      this.services.api.setHeader(this.config.tokenHeader, null);
    } catch (error) {
      console.error(error);
    }
    this.setState({...this.defaultState(), waiting: false});
  }

  /**
   * По токену восстановление сессии
   * @return {Promise<void>}
   */
  async remind() {
    const token = this.config.saveToLocalStorage ? localStorage.getItem('token') : null;
    if (token) {
      // Устанавливаем токен в АПИ
      this.services.api.setHeader(this.config.tokenHeader, token);
      // Проверяем токен выбором своего профиля
      const res = await this.services.api.endpoints.users.current({});

      if (res.data.error) {
        // Удаляем плохой токен
        window.localStorage.removeItem('token');
        this.services.api.setHeader(this.config.tokenHeader, null);
        this.setState({
          ...this.getState(), exists: false, waiting: false
        }, 'Сессии нет');
      } else {
        this.setState({
          ...this.getState(), token: token, user: res.data.result, exists: true, waiting: false
        }, 'Успешно вспомнили сессию');
      }
    } else {
      // Если токена не было, то сбрасываем ожидание (так как по умолчанию true)
      this.setState({
        ...this.getState(), exists: false, waiting: false
      }, 'Сессии нет');
    }
  }

  /**
   * Сброс ошибок авторизации
   */
  resetErrors() {
    this.setState({...this.defaultState(), errors: null});
  }

  simplifyErrors(issues: Array<{ path: string[], message: string }>) {
    const result: Record<string, string[]> = {};
    for (const issue of issues) {
      const key = issue.path.join('.') || 'other';
      if (result[key]) {
        result[key].push(issue.message);
      } else {
        result[key] = [issue.message];
      }
    }
    return result;
  }
}

export default SessionState;
