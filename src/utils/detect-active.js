import escape from './escape.js';

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
