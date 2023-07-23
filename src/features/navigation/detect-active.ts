/**
 * Поиска активного пункта меню с учётом вложенности
 * @param items Список путей. Пути с вложенными url должны идти после родительских url
 * @param location
 * @returns {*}
 */
export default (items: any[], location: any) => {
  const path = location.pathname;
  let lastActive: any = null;
  return items.map(item => {
    const result = {
      ...item,
      active: new RegExp(`^${escape(item.link + '/')}`).test(path + '/')
    };
    if (result.active) {
      if (lastActive) lastActive.active = false;
      lastActive = result;
    }
    return result;
  });
};

function escape (s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
