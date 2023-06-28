import services from './export';

export type TServicesImports = typeof services

/**
 * Названия сервисов
 */
export type TServicesNames = keyof TServicesImports;

/**
 * Конструкторы сервисов
 */
export type TServicesConstructors = {
  [P in TServicesNames]: Awaited<ReturnType<TServicesImports[P]>>["default"]
}

/**
 * Сервисы
 */
export type TServices = {
  [P in TServicesNames]: InstanceType<TServicesConstructors[P]>
}

/**
 * Настройки всех сервисов
 */
export type TServiceConfig = {
  [P in TServicesNames]?: ReturnType<TServices[P]['defaultConfig']>
}
