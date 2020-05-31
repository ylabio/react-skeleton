import cn from 'classnames';

/**
 * Всем классам добавляется префикс
 * @param block Класс блока
 * @param classes optionals Классы в формате допустимым для библиотеки classnames
 * @returns {function(...[*]=)|String} Функция для вызова только с classes или строка классов, если было передано более одного аргумента
 */
export default function (block, ...classes) {
  /**
   * @param classes Классы в формате допустимым для библиотеки classnames
   * @returns {String}
   */
  const base = block + '_theme_';
  const f = (...classes) => {
    return base + cn(classes).replace(/(\s+)/g, `$1${base}`);
  };
  return classes && classes.length ? f(classes) : f;
}
