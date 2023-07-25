import * as modules from './imports';

/**
 * Конструкторы модулей Store
 */
export type TStoreContructors = typeof modules;
/**
 * Названия модулей Store
 */
export type TStoreModuleName = keyof TStoreContructors;
/**
 * Ключи для модулей Store (на основе названий, чтобы динамически создать временные модули)
 */
export type TStoreModuleKey<Name extends TStoreModuleName> = Name | `${Name}${number}`;
/**
 * Модули Store
 */
export type TStoreModules = {
  [P in TStoreModuleName as TStoreModuleKey<P>]: InstanceType<TStoreContructors[P]>
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
  modules: Partial<TStoreModulesConfig>
}
/**
 * Всё состояние в Store
 */
export type TStoreState = {
  [P in TStoreModuleName as TStoreModuleKey<P>]: ReturnType<TStoreModules[P]['defaultState']>
}
/**
 * Функция-слушатель изменений в store
 * Для подписки в subscribe
 */
export type TStoreListener = (state: TStoreState) => void;
/**
 * Проверка на TStoreState
 */
export function isStoreState(state: TStoreState | unknown): state is TStoreState {
  return !!state || typeof state === 'object';
}
