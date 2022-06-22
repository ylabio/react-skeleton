import cn from 'classnames';

/**
 * Всем классам добавляется префикс {block}_theme_
 * @param block Класс блока
 * @param classes optionals Классы в формате допустимым для библиотеки classnames
 * @returns {function(...[*]=)|String} Функция для вызова только с classes или строка классов, если было передано более одного аргумента
 */
export default function (block: string, ...classes: (string | string[] | undefined)[]): string {
  /**
   * @param classes Классы в формате допустимым для библиотеки classnames
   * @returns {String}
   */
  const base = block + '_theme_';
  const f = (...classes: (string | undefined | string[])[][]) => {
    return base + cn(classes).replace(/(\s+)/g, `$1${base}`);
  };
  return block + ' ' + (classes && classes.length ? f(classes) : f);
}
