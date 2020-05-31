import { createBrowserHistory, createMemoryHistory } from 'history';
import qs from 'qs';
import mc from 'merge-change';

/**
 * Объект истории для роутинга
 * @type {{init, length, action, location, createHref, push, replace, go, goBack, goForward, block, listen}}
 */
const history = {
  configure: options => {
    switch (options.type) {
      case 'memory':
        Object.assign(history, createMemoryHistory(options));
        break;
      case 'browser':
      default:
        Object.assign(history, createBrowserHistory(options));
        break;
    }
  },
  /**
   * Assign from history instance after configure
   */
  length: 0,
  action: 'POP',
  location: {},
  createHref: location => {},
  push: (path, state) => {},
  replace: (path, state) => {},
  go: n => {},
  goBack: () => {},
  goForward: () => {},
  block: prompt => {},
  listen: listener => {},

  /**
   * Создание ссылки с учётом текущего пути и search (query) параметров
   * @param path Новый путь. Если не указан, то используется текущий
   * @param searchParams Объект с search параметарами. Обрабтываются также операторы $set, $unset, $leave, $pull, $push при слиянии новых параметров с текущими
   * @param clearSearch Удалить все текущие search параметры
   * @returns {string} Итоговая строка для href ссылки
   */
  makeHref(path, searchParams = {}, clearSearch = false) {
    const currentParams = history.getSearchParams();
    const newParams = clearSearch ? searchParams : mc.update(currentParams, searchParams);
    let search = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    if (!path) {
      path = history.getPath();
    }
    return path + search;
  },

  /**
   * Текуший путь в адресе
   * @returns {*}
   */
  getPath: () => {
    return history.location.pathname;
  },

  /**
   * Текущие search параметры, распарсенные из строки
   * @returns {*}
   */
  getSearchParams: () => {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true, comma: true }) || {};
  },

  /**
   * Установка search параметров
   * @param params Новые параметры
   * @param push Способ обновления Location.search. Если false, то используется history.replace()
   * @param clear Удалить текущие параметры
   * @param path Новый путь. Если не указан, то используется текущий
   */
  setSearchParams: (params, push = true, clear = false, path) => {
    const currentParams = history.getSearchParams();
    const newParams = clear ? params : mc.update(currentParams, params);
    let newSearch = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    if (push) {
      history.push((path || window.location.pathname) + newSearch + window.location.hash);
    } else {
      history.replace((path || window.location.pathname) + newSearch + window.location.hash);
    }
  },

  /**
   * Удаление всех search параметров
   * @param push Способ обновления Location.search. Если false, то используется history.replace()
   */
  clearSearchParams: (push = true) => {
    if (push) {
      history.push(window.location.pathname + window.location.hash);
    } else {
      history.replace(window.location.pathname + window.location.hash);
    }
  },

  /**
   * Custom navigations
   * @param push Способ обновления истории роутера. Если false, то используется history.replace()
   */
  goPrivate: (push = true) => {
    push ? history.push('/private') : history.replace('/private');
  },
};

export default history;
