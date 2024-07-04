export type HasMethod<M extends string | number | symbol> = {
  [name in M]: (...args: any[]) => unknown
}

/**
 * Проверка наличия метода по его названию с подтверждением для TypeScript
 * @param value Проверяемый объект
 * @param method Название метода
 */
export function hasMethod<M extends string | number | symbol>(value: HasMethod<M> | unknown, method: M): value is HasMethod<M> {
  return Boolean(value && typeof value === 'object' && method in value && typeof (value as any)[method] === 'function');
}
