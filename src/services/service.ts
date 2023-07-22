import mc from 'merge-change';
import {TServices} from "@src/services/types";

/**
 * Базовый класс модуля хранилища
 */
abstract class Service<Config = undefined, Dump = undefined> {
  protected services: TServices;
  protected config: Config;
  readonly env: ImportMetaEnv;

  /**
   * @param config Конфиг модуля
   * @param services Менеджер сервисов
   * @param env
   */
  constructor(config: Config | unknown, services: TServices, env: ImportMetaEnv) {
    this.services = services;
    this.env = env;
    this.config = mc.patch(this.defaultConfig(env), config);
  }

  /**
   * Инициализация после создания экземпляра.
   * Вызывается автоматически.
   * Используется, чтобы не переопределять конструктор
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(dump?: unknown) {
  }

  /**
   * Конфигурация по умолчанию
   */
  defaultConfig(env: ImportMetaEnv): Config | object {
    return {};
  }

  /**
   * Дамп состояния сервиса, чтобы применить дамп при инициализации.
   * Вызывается после рендера на сервере у каждого сервисов
   */
  dump() {
    return undefined as Dump;
  };
}

export default Service;
