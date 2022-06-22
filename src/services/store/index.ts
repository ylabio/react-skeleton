import * as allModules from './exports';
import mc from 'merge-change';

const modules: any = allModules;

/**
 * Хранилище состояния приложения
 */
class StoreService {
  state: any;
  listeners: any;
  modules: any;
  services: any;
  config: any;

  constructor() {
    // Состояние приложения (данные всех модулей)
    this.state = {};
    // Подписчики на изменение state
    this.listeners = [];
    // Модули
    this.modules = {};
  }

  init(config: any, services: any) {
    this.services = services;
    this.config = config;
    const names = Object.keys(modules);
    for (const name of names) {
      this.initModule({ name });
    }
    return this;
  }

  /**
   * Инициализация модуля хранилища
   * @param config
   */
  initModule(config: any) {
    if (!config.name) throw new Error('Undefined store module name ');
    config = mc.merge(this.config.states[config.name], config);
    if (config.disabled !== true) {
      // Если нет класса сопоставленного с name, то используется класс по умолчанию
      if (!config.proto) config.proto = config.name;
      if (!modules[config.proto]) throw new Error(`Not found store module "${config.name}"`);
      const constructor = modules[config.proto];

      // Экземпляр модуля
      this.modules[config.name] = new constructor(config, this.services);
      // Состояние по умочланию от модуля
      if (!this.state[config.name]) {
        this.state[config.name] = this.modules[config.name].initState();
      }
    }
  }

  /**
   * Подписка на изменение state
   * @param callback {Function}
   */
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    // Возвращаем функцию для отписки
    return () => {
      this.listeners = this.listeners.filter((item: any) => item !== callback);
    };
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   * @param [description]
   */
  setState(newState: any, description = 'Устанока') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.state);
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.groupEnd();
    }

    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const lister of this.listeners) {
      lister(this.state);
    }
  }

  /**
   * Доступ к модулю состояния
   * @param name {String} Название модуля
   * @return {StoreModule}
   */
  get(name: string) {
    return this.modules[name];
  }

  /**
   * @return {ArticlesState}
   */
  get articles() {
    return this.get('articles');
  }

  /**
   * @return {CategoriesState}
   */
  get categories() {
    return this.get('categories');
  }

  /**
   * @return {ModalsState}
   */
  get modals() {
    return this.get('modals');
  }

  /**
   * @return {SessionState}
   */
  get session() {
    return this.get('session');
  }

  /**
   * @return {FormLoginState}
   */
  get formLogin() {
    return this.get('formLogin');
  }
}

export default StoreService;
