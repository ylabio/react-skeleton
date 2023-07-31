import mc from 'merge-change';
import {TListParamsState} from './types';
import StoreModule from "@src/services/store/module";
import {SchemaObject} from "ajv/lib/types";
import {TServices} from "@src/services/types";
import {TStoreModuleKey, TStoreModuleName} from "@src/services/store/types";
import {ValidateFunction} from "ajv";

/**
 * Модуль списка с параметрами и методами добавления, удаления, редактирования элемента в списке.
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список.
 */
class ListParamsState<Item, Params, Config = object> extends StoreModule<TListParamsState<Item, Params>, Config> {
  validator: ValidateFunction;

  constructor(
    config: PartialRecursive<Config>,
    services: TServices,
    env: ImportMetaEnv,
    name: TStoreModuleKey<TStoreModuleName>)
  {
    super(config, services, env, name);
    this.validator = this.services.validator.make(this.schemaParams());
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  override defaultState(): TListParamsState<Item, Params> {
    return {
      items: [],
      count: 0,
      params: {
        limit: 20,
        page: 1,
        sort: '',
        fields: `items(*), count`,
        search: {
          //query: undefined, // поиск по строке
        }
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
  schemaParams(): SchemaObject {
    return {
      type: 'object',
      properties: {
        limit: {type: 'integer', minimum: 1},
        page: {type: 'integer', minimum: 1},
        sort: {type: 'string'},
        search: {
          type: 'object',
          properties: {

          }
        }
        //query: { type: 'string' },
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
    const defaultParams = this.defaultState().params;
    // Параметры из URL (query string)
    const queryParams = this.validateParams(this.services.router.getSearchParams());
    // Сливаем все параметры
    const newParams = mc.merge(defaultParams, queryParams, params);
    // Установка параметров и загрузка данных по ним
    return this.setParams(newParams, {merge: false, remember: false, load: true});
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
      // Слияние параметров с начальными
      mc.merge(this.defaultState().params, params),
      // Слияние параметров с текущими. Без загрузки данных, но со сбросом данных
      mc.merge({merge: false, remember: 'replace', load: false, clear: true}, options),
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
    options = mc.merge({merge: true, load: true, clear: false, remember: 'replace'}, options);
    try {
      // 1. ПАРАМЕТРЫ
      // Новые параметры (нужно ли учитывать текущие?)
      const newParams = options.merge ? mc.merge(this.getState()?.params, params) : params;
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
        this.services.router.setSearchParams(newParams, options.remember === 'push');
      }

      // 2. ДАННЫЕ
      // Загрузка данные по новым параметрам
      if (options.load) {
        // Параметры для API запроса (конвертация из всех параметров состояния с учётом новых)
        const apiParams = this.apiParams(newParams);
        // Выборка данных из АПИ
        const result = await this.load(apiParams);
        const x = mc.patch(result, {wait: false, errors: null});
        this.updateState(x, 'Список загружен');
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
      params = this.defaultState().params;
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
    };
  }

  /**
   * Загрузка данных
   * @param apiParams
   */
  async load(apiParams: any): Promise<Partial<TListParamsState<Item>>> {
    // const response = await this.api.findMany(apiParams);
    // // Установка полученных данных в состояние
    // return response.data.result;
    return {
      items: [],
      count: 0,
    };
  }

}

export default ListParamsState;
