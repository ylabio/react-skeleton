import mc from "merge-change";
import qs from "qs";
import BaseState from "@src/services/actions/base";
import services from '@src/services';

/**
 * Модуль товаров
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список товаров.
 */
class ArticlesState extends BaseState {

  defaultState() {
    return {
      items: [],
      count: 0,
      params: {
        limit: 20,
        page: 1,
        sort: '-date',
        fields: `items(*,category(title),maidIn(title)), count`,
        categoryId: null,
      },
      wait: false,
      errors: null,
    };
  }

  /**
   * Инициализация параметров и данных
   * К начальным параметрам сливаются сохраненные из location.search и переданные в params
   * @param params {Object} Новые параметры. Переопределяют начальные и сохраненные параметры
   * @returns {Promise}
   */
  async init(params = {}) {
    // В основе начальные параметры
    let newParams = this.defaultState().params;

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
    return this.set(newParams, {mergeParams: false, loadData: true, saveParams: false});
  }

  /**
   * Сброс состояния
   * @param params {Object} Новые параметры. Переопределяют начальные параметры
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *   saveParams {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *   loadData {Boolean} Загружать данные по новым параметрам
   *   clearData {Boolean} Сбросить текущие данные
   * @returns {Promise}
   */
  async reset(params = {}, options = {}) {
    options = Object.assign(
      {saveParams: 'replace', loadData: false, clearData: true, mergeParams: false},
      options,
    );
    // Сливаем начальные и новые параметры
    let newParams = mc.merge(this.defaultState().params, params);
    return this.set(newParams, options);
  }

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
  async set(params = {}, options = {}) {
    options = Object.assign(
      {saveParams: 'replace', mergeParams: true, loadData: true, clearData: false},
      options,
    );
    try {
      // Учитывая текущие параметры, установить новые.
      let prevState = this.currentState();
      let newParams = options.mergeParams ? mc.merge(prevState.params, params) : params;

      // Установка параметров, ожидания и сброс данных, если нужно
      if (options.clearData) {
        // Пока загружаются данные, текущие сбросить
        this.resetState({params: newParams, wait: options.loadData}, 'Сброс текущих данных, установка параметров, статус ожидания');
      } else {
        // Пока загружаются данные, чтобы показывались текущие
        this.updateState({wait: options.loadData, params: newParams, errors: null}, 'Установка параметров, статус ожидания');
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
        this.updateState(mc.patch(result, {wait: false, errors: null}), 'Список товаров загружен');
      }

      //  Сохранить параметры в localStoarage или location.search
      if (options.saveParams) {
        this.saveParams(newParams, options.saveParams === 'push');
      }
      return true;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        this.updateState({wait: false, errors: e.response.data.error.data.issues}, 'Ошибка от сервера');
      } else {
        throw e;
      }
    }
  }

  /**
   * Запомнить текущие параметры состояния в Location.search
   * Используется в this.set(). Напрямую нет смысла вызывать.
   * @param params {Object} Параметры для сохранения
   * @param push Способ обновления Location.search. Если false, то используется navigation.replace()
   * @returns {Boolean}
   */
  saveParams(params, push = true) {
    // Сброс и установка только своих параметров, так как в адресе могут быть и другие
    let change = {
      // По умолчанию всё сбрасывается
      $unset: ['page', 'limit', 'status', /*'categoryId',*/ 'sort'],
      $set: {},
    };
    const initState = this.defaultState();
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
  }
}

export default ArticlesState;
