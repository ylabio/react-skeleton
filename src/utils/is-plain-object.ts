/**
 * Проверка на простой объект
 */
export default function isPlainObject(value: object | any): value is object {
  return !!value && (!value.__proto__ || Object.getPrototypeOf(value).constructor.name === 'Object') ;
}
