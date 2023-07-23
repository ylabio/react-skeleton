import services from './imports';

export type TServicesImports = typeof services

/**
 * Названия сервисов
 */
export type TServiceName = keyof TServicesImports;

/**
 * Конструкторы сервисов
 */
export type TServicesConstructors = {
  [P in TServiceName]: Awaited<ReturnType<TServicesImports[P]>>["default"]
}

/**
 * Сервисы
 */
export type TServices = {
  [P in TServiceName]: InstanceType<TServicesConstructors[P]>
}

/**
 * Настройки всех сервисов
 */
export type TServicesConfig = {
  [P in TServiceName]?: ReturnType<TServices[P]['defaultConfig']>
}
