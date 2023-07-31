import dictionaries from './imports';

export type TDictionariesImports = typeof dictionaries;
/**
 * Название зарегистрированных локалей (кодов языков)
 */
export type TLocale = keyof TDictionariesImports;
export type TLocaleReal = Exclude<TLocale, '*'>;
/**
 * Названия словарей для локали
 */
export type TLocaleNamespace<Locale extends TLocale> = keyof TDictionariesImports[Locale] & string;
/**
 * Ключи переводов - варианты строковых значений.
 * Используется дженерик NestedKeyOf для вытаскивания ключей переводов из вложенного объекта и
 * превращения их в путь, например 'example.main.title'
 * Генерируются на общем словаре (*)
 */
export type TTranslationKey = NestedKeyOf<{
  [Name in TLocaleNamespace<'*'>]: TDictionariesImports['*'][Name] extends () => Promise<any>
    ? Awaited<ReturnType<TDictionariesImports['*'][Name]>>["default"]
    : TDictionariesImports['*'][Name]
}>;
/**
 * Переводы
 */
export type TTranslation = Record<TTranslationKey, string>;
/**
 * Словарь переводов
 */
export type TDictionary = Record<TLocale, TTranslation>;
/**
 * Состояние сервиса, чтобы уведомлять про изменения локали или словаря
 */
export type TI18nState = {
  locale: TLocaleReal,
  locales: TLocaleReal[],
  dictionary: TDictionary,
}

/**
 * Параметры функции перевода
 */
export interface ITranslateOptions<Locale extends TLocale> {
  /**
   * Число для поиска перевода в множественном склонении, например 1 товар, 3 товара, 5 товаров
   */
  plural?: number;
  /**
   * Перевод по умолчанию, если его нет в словаре
   */
  fall?: string;
  /**
   * Локаль, отличая от текущей
   */
  locale?: Locale,
  /**
   * Значения для вставки в именованные области, например "Привет {{name}} {{secondName}}"
   */
  values?: Record<string, string | number>
  /**
   * Ожидание загрузки словаря для интеграции с React <Suspense> (throw promise)
   */
  suspense?: boolean;
}

/**
 * Опции функции форматирования числа
 */
export interface INumberOptions extends Intl.NumberFormatOptions {
  locale?: TLocaleReal;
}

export type TTranslateFn = <L extends TLocale>(key: TTranslationKey, options?: ITranslateOptions<L>) => string;
export type TNumberFormatFn = (value: number, options?: INumberOptions) => string;
/**
 * Результат хука к i18n
 */
export type useI18nReturn = {
  // Текущая локаль
  locale: TLocaleReal,
  // Доступные локали
  locales: TLocaleReal[],
  // Функция для смены локали
  setLocale: (locale: TLocaleReal) => void,
  // Функция для локализации текстов
  t: TTranslateFn,
  // Форматирования числа с учётом локали
  n: TNumberFormatFn,
}

/**
 * Настройки сервиса ожиданий
 */
export type TI18nConfig = {
  // Локаль по умолчанию, если отключено автоопределение или не удалось определить
  locale?: TLocaleReal,
  // Подобрать локаль автоматически при первом рендере
  auto?: boolean,
  // Запоминать выбор локали в куке
  remember?: boolean
}

/**
 * Проверка на TI18nState
 */
export function isI18nState(value: TI18nState | unknown): value is Partial<TI18nState> {
  return !!value && typeof value === 'object'
    && ('locale' in value) && typeof value.locale === 'string';
}
