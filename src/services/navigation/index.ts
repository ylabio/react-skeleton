import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from 'history';
import qs from 'qs';
import mc from 'merge-change';
import { TServices} from '../types';
import Service from "@src/services/service";
import {TNavigationConfig} from "@src/services/navigation/types";

/**
 * Сервис навигации (History API)
 * Используется библиотекой react-router и для прямого управления навигации в браузере.
 * Учитывает режим работы для SSR
 */
class NavigationService extends Service<TNavigationConfig, undefined> {
  private _history: MemoryHistory | BrowserHistory;

  constructor(config: TNavigationConfig, services: TServices, env: ImportMetaEnv) {
    super(config, services, env);
    switch (this.config.type) {
      case 'memory':
        this._history = createMemoryHistory(this.config);
        break;
      case 'browser':
      default:
        this._history = createBrowserHistory(this.config);
        break;
    }
  }

  defaultConfig(env: ImportMetaEnv): TNavigationConfig {
    return {
      ...super.defaultConfig(env),
      type: env.SSR ? 'memory' : 'browser',
      basename: '/',
      initialEntries: env.req ? [env.req.url] : undefined
    };
  }

  get history() {
    return this._history;
  }

  get basename() {
    return this.config.basename;
  }

  /**
   * Создание ссылки с учётом текущего пути и search (query) параметров
   * @param path Новый путь. Если не указан, то используется текущий
   * @param searchParams Объект с search параметарами. Обрабтываются также операторы $set, $unset, $leave, $pull, $push при слиянии новых параметров с текущими
   * @param clearSearch Удалить все текущие search параметры
   * @returns {string} Итоговая строка для href ссылки
   */
  makeHref(path: string, searchParams = {}, clearSearch = false) {
    const currentParams = this.getSearchParams();
    const newParams = clearSearch ? searchParams : mc.update(currentParams, searchParams);
    const search = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    if (!path) {
      path = this.getPath();
    }
    return path + search;
  }

  /**
   * Текуший путь в адресе
   * @returns {*}
   */
  getPath() {
    return this._history.location.pathname;
  }

  /**
   * Текущие search параметры, распарсенные из строки
   * @returns {*}
   */
  getSearchParams() {
    return qs.parse(this._history.location.search, { ignoreQueryPrefix: true, comma: true }) || {};
  }

  /**
   * Установка search параметров
   * @param params Новые параметры
   * @param push Способ обновления Location.search. Если false, то используется history.replace()
   * @param clear Удалить текущие параметры
   * @param path Новый путь. Если не указан, то используется текущий
   */
  setSearchParams(params: unknown, push = true, clear = false, path?: string) {
    const currentParams = this.getSearchParams();
    const newParams = clear ? params : mc.update(currentParams, params);
    const newSearch = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    const url = (path || window.location.pathname) + newSearch + window.location.hash;
    if (push) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }

  /**
   * Удаление всех search параметров
   * @param push Способ обновления Location.search. Если false, то используется window.history.replaceState()
   */
  clearSearchParams(push = true) {
    const url = window.location.pathname + window.location.hash;
    if (push) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }

  /**
   * Custom navigations
   * @param push Способ обновления истории роутера. Если false, то используется history.replace()
   */
  goPrivate(push = true) {
    push ? this._history.push('/private') : this._history.replace('/private');
  }
}

export default NavigationService;
