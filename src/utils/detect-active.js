import escape from './escape.js';

/**
 * Поиска активного пункта меню с учётом вложенности
 * @param items Список путей. Пути с вложенными url должны идти после родительских url
 * @param location
 * @returns {*}
 */
export default (items, location) => {
  const path = location.pathname;
  let lastActive = null;
  return items.map(item => {
    item.active = new RegExp(`^${escape.regex(item.to + '/')}`).test(path + '/');
    if (item.active) {
      if (lastActive) lastActive.active = false;
      lastActive = item;
    }
    return item;
  });
};
