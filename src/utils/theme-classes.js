import cn from 'classnames';

/**
 * Всем классам добавляется префикс
 * @param base Префикс
 * @param classes optionals Классы в формате допустимым для библиотеки classnames
 * @returns {function(...[*]=)|String} Функция для вызова только с classes или строка классов, если было передано более одного аргумента
 */
export default function (base, ...classes) {
  /**
   * @param classes Классы в формате допустимым для библиотеки classnames
   * @returns {String}
   */
  const f = (...classes) => {
    return base + cn(classes).replace(/(\s+)/g, `$1${base}`);
  };
  return classes && classes.length ? f(classes) : f;
}