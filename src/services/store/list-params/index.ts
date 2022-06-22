import mc from 'merge-change';
import StoreModule from '@src/services/store/module';

/**
 * Модуль спика с параметрами и методами добавления, удаления, редактирования элемента в списке.
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список.
 */
class ListParamsState extends StoreModule<{ apiEndpoint: string }> {
  validator: any;
  api: any;

  constructor(config: any, services: any) {
    super(config, services);
    this.validator = this.services.spec.createValidator(this.schemaParams());
    this.api = this.services.api.get(this.config.apiEndpoint);
  }

  /**
   * Конфигурация по умолчанию
   * @return {Object}
   */
  defaultConfig() {
    return mc.patch(super.defaultConfig(), {
      apiEndpoint: 'crud', // абстрактный endpoint
    });
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      items: [],
      count: 0,
      params: {
        limit: 20,
        page: 1,
        sort: { date: 'asc' },
        fields: `items(*), count`,
        filter: {
          query: undefined, // поиск по строке
        },
      },
      wait: false,
      errors: null,
    };
  }

  /**
   * Описание используемых параметров в location (URL) после ?
   * Правила преобразования
   * @return {Object}
   */
  schemaParams() {
    return {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1 },
        page: { type: 'integer', minimum: 1 },
        sort: { type: 'object', additionalProperties: { enum: ['asc', 'desc'] } },
        filter: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          additionalProperties: { type: 'string' },
        },
      },
    };
  }

  /**
   * Инициализация параметров и данных
   * К начальным параметрам сливаются сохраненные из location.search и переданные в params
   * @param params {Object} Новые параметры. Переопределяют начальные и сохраненные параметры
   * @returns {Promise}
   */
  async initParams(params = {}) {
    // В основе начальные параметры
    const defaultParams = this.initState().params;
    // Параметры из URL (query string)
    const queryParams = this.validateParams(this.services.navigation.getSearchParams());
    // Сливаем все параметры
    const newParams = mc.merge(defaultParams, queryParams, params);
    // Установка параметров и загрузка данных по ним
    return this.setParams(newParams, { merge: false, remember: false, load: true });
  }

  /**
   * Сброс состояния
   * @param params {Object} Новые параметры. Переопределяют начальные параметры
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *   remember {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *   load {Boolean} Загружать данные по новым параметрам
   *   clear {Boolean} Сбросить текущие данные
   * @returns {Promise}
   */
  async resetParams(params = {}, options = {}) {
    return this.setParams(
      // мержим параметры с начальными
      mc.merge(this.initState().params, params),
      // мержить параметры с текущими и загружать данные не надо, но надо сбросить данные
      mc.merge({ merge: false, remember: 'replace', load: false, clear: true }, options),
    );
  }

  /**
   * Установка новых параметров и загрузка данных по ним
   * @param params {Object} Новые параметры. Переопределяют текущие если merge или полностью заменяют их
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *  remember {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *  load {Boolean} Загружать данные по новым параметрам
   *  clear {Boolean} Сбросить текущие данные
   *  merge {Boolean} Объединять новые параметры с текущим. Иначе полная замена на новые.
   * @returns {Promise}
   */
  async setParams(params: any = {}, options: any = {}) {
    options = mc.merge({ merge: true, load: true, clear: false, remember: 'replace' }, options);
    try {
      // 1. ПАРАМЕТРЫ
      // Новые параметры (нужно ли учитывать текущие?)
      let newParams = options.merge ? mc.merge(this.getState().params, params) : params;
      if (options.clear) {
        // Сброс текущих данных, установка новых параметров
        // Если данные будут загружаться, то установка состояние ожидания
        this.resetState(
          {
            params: newParams,
            wait: options.load,
          },
          'Сброс текущих данных, установка параметров и статус ожидания',
        );
      } else {
        // Сброс только ошибок, установка новых параметров
        // Если данные будут загружаться, то установка состояние ожидания
        this.updateState(
          {
            wait: options.load,
            params: newParams,
            errors: null,
          },
          'Установка параметров и статуса ожидания',
        );
      }
      //  Сохранить параметры в location.search
      if (options.remember) {
        this.services.navigation.setSearchParams(newParams, options.remember === 'push');
      }

      // 2. ДАННЫЕ
      // Загрузка данные по новым параметрам
      if (options.load) {
        // Параметры для API запроса (конвертация из всех параметров состояния с учётом новых)
        const apiParams = this.apiParams(newParams);
        // Выборка данных из АПИ
        const response = await this.api.findMany(apiParams);
        // Установка полученных данных в состояние
        const result = response.data.result;
        this.updateState(mc.patch(result, { wait: false, errors: null }), 'Список загружен');
      }
      return true;
    } catch (e: any) {
      if (e.response?.data?.error?.data) {
        this.updateState(
          {
            wait: false,
            errors: e.response.data.error.data.issues,
          },
          'Ошибка от сервера',
        );
      } else {
        throw e;
      }
    }
  }

  /**
   * Проверка параметров по схеме
   * Если есть ошибки, то возвращаются параметры по умолчанию
   * @param params {Object}
   * @return {Object} Корректные параметры
   */
  validateParams(params: any) {
    if (!this.validator(params)) {
      params = this.initState().params;
    }
    return params;
  }

  /**
   * Параметры для АПИ запроса выборки данных
   * @param params {Object} Исходные параметры из состояния
   * @return {Object} Подготовленные для запроса параметры
   */
  apiParams(params: any) {
    return {
      limit: params.limit,
      skip: (params.page - 1) * params.limit,
      fields: params.fields.replace(/\s/g, ''),
      sort: params.sort,
      filter: params.filter,
    };
  }
}

export default ListParamsState;
