import StoreModule from "@src/services/store/module";
import {IProfileState} from "@src/features/auth/store/profile/types";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<undefined> {

  defaultState(): IProfileState {
    return {
      data: null,
      waiting: false // признак ожидания загрузки
    };
  }

  /**
   * Загрузка профиля
   * @return {Promise<void>}
   */
  async load() {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.setState({
      data: null,
      waiting: true
    });
    const {data} = await this.services.api.endpoints.users.current({});
    // Профиль загружен успешно
    this.setState({
      data: data.result,
      waiting: false
    }, 'Загружен профиль из АПИ');
  }
}

export default ProfileState;
