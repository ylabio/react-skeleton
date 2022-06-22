import StoreModule from '@src/services/store/module';

class FormLoginState extends StoreModule {
  initState() {
    return {
      data: {
        login: '',
        password: '123456',
      },
      wait: false,
      errors: null,
    };
  }

  /**
   * Изменение полей формы
   * @param data
   */
  change(data: any) {
    this.updateState({ data }, 'Редактирование формы');
  }

  /**
   * Отправка формы в АПИ
   * @param data
   * @returns {Promise<*>}
   */
  async submit(data: any) {
    this.updateState({ wait: true, errors: null }, 'Отправка формы');
    try {
      const response = await this.services.api.get('users').login(data);
      const result = response.data.result;
      // Установка и сохранение сессии
      await this.store.session.save({ user: result.user, token: result.token });
      this.resetState({}, 'Сброс формы после успешной отправки');
      return result;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.error) {
        this.updateState(
          { wait: false, errors: e.response.data.error.data.issues },
          'Ошибка от сервера',
        );
      } else {
        throw e;
      }
    }
  }
}

export default FormLoginState;
