import * as modules from './imports';
import Service from "@src/services/service";
import {
  TStoreConfig, TStoreModuleKey, TStoreModuleName,
  TStoreModules, TStoreModulesConfig, TStoreModulesState
} from "@src/services/store/types";

/**
 * Хранилище состояния приложения
 */
class StoreService extends Service<TStoreConfig, TStoreModulesState> {
  // Модули состояния
  readonly modules: TStoreModules = {} as TStoreModules;

  override defaultConfig(env: ImportMetaEnv): TStoreConfig {
    return {
      log: env.DEV,
      modules: {}
    };
  }

  /**
   * Инициализация сервиса
   * @param dump Предустановленное начальное состояние. Обычно используется при SSR
   */
  override init(dump?: unknown) {
    const state: Partial<TStoreModulesState> = dump ? dump : {};
    const names = Object.keys(modules) as TStoreModuleName[];
    for (const name of names) {
      this.create(name, name, undefined, state[name]);
    }
  }

  /**
   * Дамп текущего состояния всех модулей состояния.
   * Используется на сервере, чтобы передать состояние клиенту после SSR
   */
  override dump(): TStoreModulesState {
    const result = {} as TStoreModulesState;
    const keys = Object.keys(this.modules) as TStoreModuleName[];
    const put = <Key extends TStoreModuleName>(key: Key, value: TStoreModulesState[Key]) => {
      result[key] = value;
    };
    for (const key of keys) put(key, this.modules[key].getState());
    return result;
  };

  /**
   * Инициализация модуля состояния, если его ещё нет в this.modules
   * @param name Название базового модуля.
   * @param key Ключ нового модуля, по которому будет обращение к действиям и состоянию. Должно начинаться с имени базового модуля.
   * @param config Настройки модуля. По умолчанию используются настройки базового модуля.
   * @param state Предустановленное начальное состояние модуля. Обычно используется после рендера на сервере.
   */
  create<Name extends TStoreModuleName, Key extends TStoreModuleKey<Name>>(
    name: Name,
    key: Key,
    config?: TStoreModulesConfig[Key],
    state?: TStoreModulesState[Key]
  ) {
    if (!this.modules[key]) {
      if (!modules[name]) throw new Error(`Not found store module "${name}"`);
      const constructor = modules[name];
      this.modules[key] = new constructor(
        config || this.config.modules[key] as TStoreModulesConfig[Key],
        this.services,
        this.env,
        name
      ) as TStoreModules[Key];
      if (state) this.modules[key].setState(state as any);
      // if (state) this.modules[key].state = state;
    }
  }

  /**
   * Удаление модуля состояния.
   * Применяется для динамически созданных модулей
   * @param key
   */
  delete(key: TStoreModuleKey<TStoreModuleName>) {
    if (this.modules[key]) {
      delete this.modules[key];
    }
  }
}

export default StoreService;
