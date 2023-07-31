import * as modules from './imports';

/**
 * Конструкторы модулей Store
 */
export type TStoreModuleContructors = typeof modules;
/**
 * Названия модулей Store
 */
export type TStoreModuleName = keyof TStoreModuleContructors;
/**
 * Ключи для модулей Store (на основе названий, чтобы динамически создать временные модули)
 */
export type TStoreModuleKey<Name extends TStoreModuleName> = Name | `${Name}${number}`;
/**
 * Модули Store
 */
export type TStoreModules = {
  [P in TStoreModuleName as TStoreModuleKey<P>]: InstanceType<TStoreModuleContructors[P]>
}
/**
 * Всё состояние от модулей Store
 */
export type TStoreModulesState = {
  [P in keyof TStoreModules]: ReturnType<TStoreModules[P]['getState']>
}

/**
 * Настройки модулей Store
 */
export type TStoreModulesConfig = {
  [P in TStoreModuleName as TStoreModuleKey<P>]: ReturnType<TStoreModules[P]['defaultConfig']>
}

/**
 * Настройки сервиса Store
 */
export type TStoreConfig = {
  log?: boolean,
  modules: PartialRecursive<TStoreModulesConfig>
}

