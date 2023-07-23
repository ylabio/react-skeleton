import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from 'history';
import qs from 'qs';
import mc from 'merge-change';
import { TServices} from '@src/services/types';
import Service from "@src/services/service";
import {TNavigationConfig} from "@src/features/navigation/types";

/**
 * Сервис навигации (History API)
 * Определят вспомогательные методы для создания ссылок и изменениям query параметров адреса.
 * Создаёт объект навигации для React Router с учётом режима рендера (браузер/сервер)
 */
class NavigationService extends Service<TNavigationConfig, undefined> {
  readonly history: MemoryHistory | BrowserHistory;

  constructor(config: TNavigationConfig, services: TServices, env: ImportMetaEnv) {
    super(config, services, env);
    switch (this.config.type) {
      case 'memory':
        this.history = createMemoryHistory(this.config);
        break;
      case 'browser':
      default:
        this.history = createBrowserHistory(this.config);
        break;
    }
  }

  defaultConfig(env: ImportMetaEnv): TNavigationConfig {
    return {
      ...super.defaultConfig(env),
      type: env.SSR ? 'memory' : 'browser',
      basename: env.BASE_URL,
      initialEntries: env.req ? [env.req.url] : undefined
    };
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
    return this.history.location.pathname;
  }

  /**
   * Текущие search параметры, распарсенные из строки
   * @returns {*}
   */
  getSearchParams() {
    return qs.parse(this.history.location.search, { ignoreQueryPrefix: true, comma: true }) || {};
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
}

export default NavigationService;
