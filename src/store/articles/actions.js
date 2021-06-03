//import store from '@src/store';
import services from '@src/services';
//import * as api from '@src/api';
//import navigation from '@src/app/navigation.js';
import qs from 'qs';
import mc from 'merge-change';
import initState, { types } from './state.js';

const actions = {
  /**
   * Инициализация параметров и данных
   * К начальным параметрам сливаются сохраненные из location.search и переданные в params
   * @param params {Object} Новые параметры. Переопределяют начальные и сохраненные параметры
   * @returns {Promise}
   */
  init: async (params = {}) => {
    // В основе начальные параметры
    let newParams = { ...initState.params };

    // Сливаем параметры из location.search, нормализуя их
    const searchParams = services.navigation.getSearchParams();
    if (searchParams.limit) {
      newParams.limit = Math.max(1, Math.min(1000, parseInt(searchParams.limit)));
    }
    if (searchParams.page) {
      newParams.page = Math.max(1, parseInt(searchParams.page));
    }
    // if (searchParams.categoryId) {
    //   newParams.categoryId = searchParams.categoryId;
    // }
    if (searchParams.sort) {
      newParams.sort = searchParams.sort;
    }
    // Сливаем новые параметры
    newParams = mc.merge(newParams, params);
    // Установка параметров и загрузка данных по ним
    return actions.set(newParams, { mergeParams: false, loadData: true, saveParams: false });
  },

  /**
   * Сброс состояния
   * @param params {Object} Новые параметры. Переопределяют начальные параметры
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *   saveParams {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *   loadData {Boolean} Загружать данные по новым параметрам
   *   clearData {Boolean} Сбросить текущие данные
   * @returns {Promise}
   */
  reset: async (params = {}, options = {}) => {
    options = Object.assign(
      { saveParams: 'replace', loadData: false, clearData: true, mergeParams: false },
      options,
    );
    // Сливаем начальные и новые параметры
    let newParams = objectUtils.merge(initState.params, params);
    return actions.set(newParams, options);
  },

  /**
   * Установка новых параметров и загрузка данных по ним
   * @param params {Object} Новые параметры. Переопределяют текущие если mergeParams или полностью заменяют их
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *  saveParams {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *  loadData {Boolean} Загружать данные по новым параметрам
   *  clearData {Boolean} Сбросить текущие данные
   *  mergeParams {Boolean} Объединять новые параметры с текущим. Иначе полная замена на новые.
   * @returns {Promise}
   */
  set: async (params = {}, options = {}) => {
    options = Object.assign(
      { saveParams: 'replace', mergeParams: true, loadData: true, clearData: false },
      options,
    );
    try {
      // Учитывая текущие параметры, установить новые.
      let prevState = services.store.getState().article;
      let newParams = options.mergeParams ? mc.merge(prevState.params, params) : params;

      // Установка параметров, ожидания и сброс данных, если нужно
      if (options.clearData) {
        // Пока загружаются данные, текущие сбросить
        services.store.dispatch({
          type: types.SET,
          payload: mc.merge(initState, { params: newParams, wait: options.loadData }),
        });
      } else {
        // Пока загружаются данные, чтобы показывались текущие
        services.store.dispatch({
          type: types.SET,
          payload: { wait: options.loadData, params: newParams, errors: null },
        });
      }

      // Загрузка данные по новым параметрам
      if (options.loadData) {
        // Параметры для API запроса (конвертация из всех параметров состояния с учётом новых)
        const queryParams = {
          limit: newParams.limit,
          skip: (newParams.page - 1) * newParams.limit,
          fields: newParams.fields.replace(/\s/g, ''),
          sort: newParams.sort,
          search: {
            category: newParams.categoryId ? newParams.categoryId : undefined,
          },
        };
        // Выборка данных из АПИ
        const response = await services.api.endpoint('articles').getList(queryParams);

        // Установка полученных данных в состояние
        const result = response.data.result;
        services.store.dispatch({
          type: types.SET,
          payload: mc.patch(result, { wait: false, errors: null }),
        });
      }

      //  Сохранить параметры в localStoarage или location.search
      if (options.saveParams) {
        actions.saveParams(newParams, options.saveParams === 'push');
      }
      return true;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        services.store.dispatch({
          type: types.SET,
          payload: { wait: false, errors: e.response.data.error.data.issues },
        });
      } else {
        throw e;
      }
    }
  },

  /**
   * Запомнить текущие параметры состояния в Location.search
   * Используется в actions.apply(). Напрямую нет смысла вызывать.
   * @param params {Object} Параметры для сохранения
   * @param push Способ обновления Location.search. Если false, то используется navigation.replace()
   * @returns {Boolean}
   */
  saveParams: (params, push = true) => {
    // Сброс и установка только своих параметров, так как в адресе могут быть и другие
    let change = {
      // По умолчанию всё сбрасывается
      $unset: ['page', 'limit', 'status', /*'categoryId',*/ 'sort'],
      $set: {},
    };
    // Устанвока параметров, которые отличаются от начальных (от значений по умолчанию)
    if (params.page !== initState.params.page) {
      change.$set.page = params.page;
    }
    if (params.limit !== initState.params.limit) {
      change.$set.limit = params.limit;
    }
    // if (params.categoryId !== initState.params.categoryId) {
    //   change.$set.categoryId = params.categoryId;
    // }
    if (params.sort !== initState.params.sort) {
      change.$set.sort = params.sort;
    }
    // Установка URL
    const currentParams = services.navigation.getSearchParams();
    const newParams = mc.merge(currentParams, change);
    let newSearch = qs.stringify(newParams, {
      addQueryPrefix: true,
      arrayFormat: 'comma',
      encode: false,
    });
    services.navigation.setSearchParams(change, push);
    return true;
  },
};

export default actions;
