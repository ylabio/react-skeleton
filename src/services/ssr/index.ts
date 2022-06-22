import { renderToString } from 'react-dom/server';

declare global {
  interface Window { stateKey: string; }
}


class SSRService {
  keys: any;
  services: any;
  config: any;
  promises: any;

  init(config: any, services: any) {
    this.services = services;
    this.config = config;
    this.promises = [];
    this.keys = {};
  }

  /**
   * SERVER
   * Рендер приложения на сервере с ожиданием асинхронных действий.
   * Асинхронные действия регистрируются методом prepare(), обычно в хуке useInit()
   * @param JSX React приложение
   * @returns {Promise<void>}
   */
  async render(JSX: any) {
    let result;
    let maxDepth = this.config.maxDepth;
    do {
      // Ждем текущие асинхронные действия
      await Promise.all(this.promises);
      this.promises = [];
      result = renderToString(JSX);
      // Если новых действий не зарегистрировано или превышена вложенность ожиданий, то рендер готов
    } while (this.promises.length && --maxDepth > 0);
    return result;
  }

  /**
   * SERVER
   * Добавление ожидания действия перед рендером на сервере
   * @param callback {Promise|Function}
   * @param key {String} Ключ, под которым будут загружаться данные
   * @return {Promise} Промис переданного callback
   */
  async prepare(callback: (payload: boolean) => any, key: string) {
    if (key) {
      if (!this.hasPrepare(key)) {
        this.keys[key] = callback instanceof Promise ? callback : callback(true);
        this.promises.push(this.keys[key]);
      }
      return this.keys[key];
    } else {
      return callback instanceof Promise ? callback : callback(true);
    }
  }

  /**
   * SERVER & CLIENT
   * Проверка существования ожидания по ключу, с которым вызывался prepare() на сервере
   * @param key {String}
   * @return {Boolean}
   */
  hasPrepare(key: string) {
    return key && key in this.keys;
  }

  /**
   * CLIENT
   * Удаление ожидания по ключу
   * Используется на клиенте, чтобы разблокировать логику работы с состоянием
   * @param key {String}
   */
  deletePrepare(key: string) {
    if (this.hasPrepare(key)) {
      delete this.keys[key];
    }
  }

  /**
   * SERVER
   * Ключи текущих ожиданий
   * @return {Array<String>}
   */
  getPrepareKeys() {
    return Object.keys(this.keys);
  }

  /**
   * CLIENT
   * Установка включений ожиданий, с целью предотвратить их повторное исполнение или заблокировать логику на клиенте
   * @param keys {Array<String>}
   */
  setPrepareKeys(keys: string[]) {
    for (const key of keys) {
      this.keys[key] = true;
    }
  }

  /**
   * SERVER & CLIENT
   * Ключ для всего состояния.
   * На сервере берется из конфига, куда попадает из параметров воркера
   * На клиенте из window.stateKey, куда попадает из подготовленного сервером HTML
   * @returns {String}
   */
  getStateKey() {
    if (this.services.env.IS_WEB) {
      return window.stateKey;
    } else {
      return this.config.stateKey;
    }
  }

  /**
   * CLIENT
   * Имеется ли подготовленное состояние от серверного рендера
   * @returns {Boolean}
   */
  hasPreloadState() {
    return this.services.env.IS_WEB && !!window.stateKey;
  }

  /**
   * CLIENT
   * Выборка всего подготовленного состояния с клиента по HTTP запрсом к серверу
   * @returns {Promise<*>}
   */
  async getPreloadState() {
    const ssrApi = this.services.api.get('ssr');
    const response = await ssrApi.getPreloadState({ key: this.getStateKey() });
    // Ключ исполненных prepare()
    if (response.data.keys) {
      this.setPrepareKeys(response.data.keys);
    }
    // Данные для store
    if (response.data.state) {
      return response.data.state;
    } else {
      return {};
    }
  }
}

export default SSRService;
