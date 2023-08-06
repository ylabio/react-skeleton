import mc from 'merge-change';
import exclude from "@src/utils/exclude";
import {
  DefaultConfig,
  DefaultParams,
  SetParamsOptions,
  TDataParamsState
} from './types';
import StoreModule from "@src/services/store/module";
import {TServices} from "@src/services/types";
import {TStoreModuleKey, TStoreModuleName} from "@src/services/store/types";
import {JSONSchemaType, ValidateFunction} from 'ajv';
import {PartialDeep} from 'type-fest';

/**
 * Данные и параметры, от которых напрямую зависят данные.
 * Абстрактный модуль состояния для реализации конкретных модулей наследованием.
 * Принцип работы: устанавливаются параметры -> автоматически подгружаются данные с учётом новых параметров.
 * Параметры могут сохраняться в адрес браузера (в search) и восстанавливаться при инициализации состояния.
 * Логика загрузки реализуется в наследуемом классе.
 * В наследуемых классах определяется тип данных, расширяется тип параметров и настроек.
 */
abstract class DataParamsState<
  Data,
  Params extends DefaultParams = DefaultParams,
  Config extends DefaultConfig = DefaultConfig
> extends StoreModule<TDataParamsState<Data, Params>, Config> {
  /**
   * Валидация параметров
   */
  readonly validateParams: ValidateFunction<PartialDeep<Params>>;

  constructor(
    config: Patch<Config>,
    services: TServices,
    env: ImportMetaEnv,
    name: TStoreModuleKey<TStoreModuleName>
  ) {
    super(config, services, env, name);
    this.validateParams = this.services.validator.make(this.paramsSchema());
  }

  override defaultConfig(env: ImportMetaEnv): Config {
    return {
      ...super.defaultConfig(env),
      rememberParams: true
    };
  }

  override defaultState(): TDataParamsState<Data, Params> {
    return {
      data: {} as Data,
      params: {
        limit: 20,
        page: 1,
        sort: '',
      } as Params,
      wait: false,
      errors: null,
    };
  }

  /**
   * Схема валидации сохраняемых (экспортируемых) параметров
   */
  paramsSchema(): JSONSchemaType<PartialDeep<Params>> {
    return {
      type: 'object',
      properties: {
        limit: {type: 'integer', minimum: 1},
        page: {type: 'integer', minimum: 1},
        sort: {type: 'string'},
      },
      required: [],
      additionalProperties: false
    } as JSONSchemaType<Params>;
  }

  /**
   * Инициализация и восстановление параметров
   * @param newParams Корректировка параметров по-умолчанию и восстановленных из адреса
   * @param options Опции, влияющие на логику смены параметров и загрузку новых данных
   */
  async initParams(newParams: Patch<Params>, options: SetParamsOptions = {}) {
    // Параметры из URL (query string)
    const restoreParams = this.restoreParams() as Patch<Params>;
    // Сливаем все параметры
    const params = mc.merge(this.defaultState().params, restoreParams, newParams) as Patch<Params>;
    // Установка параметров и загрузка данных по ним
    return this.setParams(params, {push: false, load: true, ...options});
  }

  /**
   * Сброс параметров
   * @param newParams Корректировка параметров по-умолчанию
   * @param options Опции, влияющие на логику смены параметров и загрузку новых данных
   */
  async resetParams(newParams: Patch<Params>, options: SetParamsOptions = {}) {
    // Сливаем с параметрами по умолчанию
    const params = {...this.defaultState().params, ...newParams};
    // Установка параметров и загрузка данных по ним
    return this.setParams(params, {push: true, load: true, ...options});
  }

  /**
   * Установка новых параметров
   * @param newParams Корректировка текущих параметров
   * @param options Опции, влияющие на логику смены параметров и загрузку новых данных
   */
  async setParams(newParams: Patch<Params>, options: SetParamsOptions = {}) {
    // Опции по умолчанию
    options = {load: true, push: true, ...options};
    try {
      // Новые параметры (нужно ли учитывать текущие?)
      const params: Params = mc.merge(this.state.params, newParams);
      if (options.clear) {
        // Сброс текущих данных (списка), установка новых параметров
        // Если данные будут загружаться, то установка состояние ожидания
        this.resetState({
          params: {$set: params} as Patch<Params>, // Через $set, чтобы исключить слияние с текущими (оно уже выполнено)
          wait: options.load,
        }, 'Сброс текущих данных, установка параметров и статус ожидания');
      } else {
        // Установка новых параметров без сброса данных
        // Если данные будут загружаться, то установка состояние ожидания
        this.updateState({
          params: {$set: params} as Patch<Params>,
          wait: options.load,
          errors: null,
        }, 'Установка параметров и статуса ожидания');
      }
      //  Сохранить параметры
      if (this.config.rememberParams) this.saveParams(options.push);

      // Загрузка данные по новым параметрам
      if (options.load) {
        // Параметры для API запроса (конвертация из всех параметров состояния с учётом новых)
        const apiParams = this.apiParams(params);
        // Выборка данных из АПИ
        this.updateState({
          data: await this.loadData(apiParams),
          wait: false,
          errors: null
        }, 'Список загружен');
      }
    } catch (e: any) {
      if (e.response?.data?.error?.data) {
        this.updateState({
          wait: false,
          errors: e.response.data.error.data.issues,
        }, 'Ошибка от сервера',);
      } else {
        throw e;
      }
    }
  }

  /**
   * Экспортирование параметров, например для сохранения или использования в URL
   * Результатом являются параметры скорректированные/отфильтрованные валидатором по схеме
   * и сгруппированные под именем модуля состояния.
   * @param params
   * @param mergeWithCurrent
   */
  exportParams(params: Params | Patch<Params>, mergeWithCurrent = false){
    if (mergeWithCurrent) params = mc.merge(this.state.params, params as Patch<Params>) as Params;
    // Исключение параметров, у которых значение по умолчанию
    let searchParams = exclude(params, this.defaultState().params) as PartialDeep<Params>;
    if (!this.validateParams(searchParams)) searchParams = {} as PartialDeep<Params>;
    // Если валидация пройдена, то searchParams скорректирован по схеме
    // Параметры группируются под именем модуля
    return {[this.name]: searchParams};
  }

  /**
   * Сохранение текущих параметров в history api (в search параметр адреса)
   * @param push
   */
  protected saveParams(push = true) {
    const savedParams = this.exportParams(this.state.params, false);
    this.services.router.setSearchParams(savedParams, push);
  }

  /**
   * Восстановление параметров из адреса страницы (из search параметра адреса)
   */
  protected restoreParams(): PartialDeep<Params> {
    // Распарсенные параметры берутся по названию модуля состояния, так группировались по его имени
    const searchParams = this.services.router.getSearchParams()[this.name];
    // После успешной валидации в searchParams останутся только допустимые параметры
    if (searchParams && this.validateParams(searchParams)) {
      return searchParams;
    }
    return {} as PartialDeep<Params>;
  }

  /**
   * Параметры для АПИ запроса данных
   * @param params Исходные параметры из состояния
   */
  protected apiParams(params: Params): any {
    return {
      limit: params.limit,
      skip: (params.page - 1) * params.limit,
      sort: params.sort,
    };
  }

  /**
   * Загрузка данных
   * Необходимо реализовать логику в наследуемом классе
   * @param apiParams
   */
  protected async loadData(apiParams: any): Promise<Data> {
    return {} as Data;
  }
}

export default DataParamsState;
