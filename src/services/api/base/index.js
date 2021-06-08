import mc from "merge-change";
import services from '@src/services';

/**
 * Базовый (абстрактный) класс точки доступа к АПИ
 */
class BaseEndpoint {

  constructor(config) {
    this.config = mc.patch(this.defaultConfig(), config);
  }

  /**
   * Конфигурация по умолчанию
   * Переопределяется общими параметрами сервиса api и параметрами из конфига экземпляра
   * @return {Object}
   */
  defaultConfig() {
    return {
      url: '/api/v1/base',
      //baseURL: '',
      //headers: {},
      //auth:{} base auth
    };
  }

  /**
   * Запрос
   * @return {*}
   */
  request(options) {
    // Учитываются опции модуля и переданные в аргументах
    return services.api.axios.request(mc.merge(this.config, options));
  }
}

export default BaseEndpoint;
