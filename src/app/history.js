import { createBrowserHistory, createMemoryHistory } from 'history';

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
   * Assign from history instance after init
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
   * Custom navigations
   */
  goPrivate: () => {
    history.push('/private');
  },
};

export default history;
