/**
 * Все названия методов из типа
 */
export type ExtractMethodNames<T, M = (...args: any[]) => any> = {
  [K in keyof T]: T[K] extends M ? K : never
}[keyof T];
