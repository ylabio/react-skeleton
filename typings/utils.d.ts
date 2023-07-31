/**
 * Partial в глубину для свойств объекта
 */
type PartialRecursive<T> =
  T extends (infer U)[] ? U[] :
    T extends object ? { [K in keyof T]?: PartialRecursive<T[K]> } :
      T;


/**
 * Формирует пути на свойства объекта с учётом вложенности
 * Например NestedKeyOf<typeof {a: {b: {c: 100}}, d: 1 }> => type "a.b.c" | "d"
 */
type NestedKeyOf<Obj extends object> = {
  [Name in keyof Obj & string]: // Перебираем ключи объекта
  Obj[Name] extends unknown[]
    ? Name // Массивы не обрабатываются в глубину - берем название массива
    : (
      Obj[Name] extends object
        ? Name | `${Name}.${NestedKeyOf<Obj[Name]>}` // Объект смотрим в глубину. Берем название объекта и "пути" на все его свойства
        : Name // Для остальных типов берем их название
      )
}[keyof Obj & string]; // Вытаскиваем типы всех свойств - это строковые литералы (пути на свойства)
