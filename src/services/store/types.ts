import * as modules from './exports';

/**
 * Конструкторы модулей Store
 */
export type TStoreContructors = typeof modules;

/**
 * Названия модулей Store
 */
export type TStoreNames = keyof TStoreContructors;

/**
 * Модули Store
 */
export type TStoreModules = {
  [P in TStoreNames]: InstanceType<TStoreContructors[P]>
}

/**
 * Всё состояние в Store
 */
export type TStoreState = {
  [P in TStoreNames]: ReturnType<TStoreModules[P]['initState']>
}

/**
 * Настройки Store и его модулей
 */
export type TStoreConfig = {
  log: boolean,
  states: {
    [P in TStoreNames]?: ReturnType<TStoreModules[P]['defaultConfig']>
  }
}

/**
 * Функция-слушатель изменений в store
 * Для подписки в subscribe
 */
export type TStoreListener = (state: TStoreState) => void;

/**
 * Проверка на TStoreState
 */
export default function isStoreState(state: TStoreState | unknown): state is TStoreState {
  return !!state || typeof state === 'object';
}
