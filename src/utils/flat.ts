import isPlainObject from "@src/utils/is-plain-object";

/**
 * Конвертация вложенной структуры в плоскую
 * Названия свойств превращаются в путь {a: {b: 0}}  => {'a.b': 0}
 * @param value Исходный объекты для конвертации
 * @param [path] Базовый путь для формирования ключей плоского объекта. Используется для рекурсии.
 * @param [separator] Разделитель для названий ключей плоского объекта
 * @param [result] Результат - плоский объект. Передаётся по ссылки для рекурсии
 */
export default function flat(
  value: Record<string, any>,
  path = '',
  separator = '.',
  result:Record<string, any> = {}
) {
  if (isPlainObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      flat(item, path ? `${path}${separator}${key}` : key, separator, result);
    }
  } else {
    if (path === '') {
      result = value;
    } else {
      result[path] = value;
    }
  }
  return result;
}
