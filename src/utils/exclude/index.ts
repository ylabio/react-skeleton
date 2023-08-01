import isPlainObject from '../is-plain-object';

/**
 * Возвращает новый объект, в котором не будет совпадений со вторым объектом
 * @param objectSrc {Object} Исходный объект
 * @param objectExc {Object} Объект-маска, вырезаемый из objectSrc
 * @returns {Object} Новый объект
 */

export default function exclude<A, B>(objectSrc: A, objectExc: B): A | PartialRecursive<A> {
  if (isPlainObject(objectSrc) && isPlainObject(objectExc)) {
    const result = {...objectSrc} as Record<string, any>;
    const keys = Object.keys(objectSrc);
    for (const key of keys) {
      if (objectSrc[key] !== objectExc[key]) {
        result[key] = exclude(objectSrc[key], objectExc[key]);
        if (isPlainObject(result[key]) && Object.keys(result[key]).length === 0 && Object.keys(objectSrc[key]).length > 0) {
          delete result[key];
        }
      } else {
        delete result[key];
      }
    }
    return result as PartialRecursive<A>;
  } else {
    return objectSrc;
  }
}
