import Service from "@src/services/service";
import {IObservable, TListener} from "@src/utils/observable/types";
import {
  TDictionary, TTranslation, TTranslationKey, TLocale, TLocaleReal, TLocaleNamespace,
  TI18nState, isI18nState, INumberOptions, TI18nConfig, ITranslateOptions
} from "@src/services/i18n/types";
import dictionaries from './imports';
import flat from "@src/utils/flat";
import acceptLang from 'accept-language-parser';
import cookie from 'js-cookie';

/**
 * Сервис модальных окон
 */
class I18nService extends Service<TI18nConfig, TI18nState> implements IObservable<TI18nState> {
  private state: TI18nState = {
    locale: 'ru-RU',
    locales: Object.keys(dictionaries).filter(l => l != '*') as TLocaleReal[],
    dictionary: {} as TDictionary,
  };
  private listeners: TListener<TI18nState>[] = [];

  defaultConfig(env: ImportMetaEnv): TI18nConfig {
    return {
      locale: 'ru-RU',
      auto: true,
      remember: true,
    };
  }

  init(dump?: unknown) {
    let locale;
    if (this.config.locale) locale = this.config.locale;
    // Автоопределение локали по заголовку accept-language
    if (this.config.auto) locale = this.detectLocale();
    // Восстановление ранее выбранной локали из куки
    if (this.config.remember) locale = this.restoreLocale();
    // Локаль устанавливается, если имеется в списке допустимых
    if (locale && this.state.locales.includes(locale)) this.state = {...this.state, locale};
    // Установка состояния после рендера на сервере
    if (isI18nState(dump)) this.state = {...this.state, ...dump};
    this.setDependencies(this.state.locale);
  }

  dump() {
    return this.getState();
  }

  subscribe = (callback: TListener<TI18nState>) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((item: TListener<TI18nState>) => item !== callback);
    };
  };

  notify = (state: TI18nState) => {
    for (const listener of this.listeners) listener(state);
  };

  getState = () => {
    return this.state;
  };

  setState = (state: Partial<TI18nState>) => {
    this.state = {...this.state, ...state};
    this.notify(this.state);
  };

  /**
   * Установка локали
   * @param locale
   */
  setLocale = async (locale: TLocaleReal) => {
    if (this.config.remember) this.rememberLocale(locale);
    this.setDependencies(locale);
    this.setState({locale});
  };


  /**
   * Установка переводов
   * @param locale Локаль (код языка)
   * @param namespace Название словаря
   * @param translations Переводы вложенным или плоским объектом
   */
  setTranslations<Locale extends TLocale>(locale: Locale, namespace: TLocaleNamespace<Locale>, translations: object) {
    const dictionary = {
      ...this.getState().dictionary,
      [locale]: {...this.getState().dictionary[locale]}
    } as TDictionary;
    // Конвертация вложенной структуры переводов в плоскую
    const translationsFlat = flat(translations, namespace);
    // Добавление загруженных переводов в словарь
    for (const [key, value] of Object.entries(translationsFlat)) {
      dictionary[locale][key as TTranslationKey] = value;
    }
    // Смена состояния, чтобы компоненты использующие перевод перерендерились
    this.setState({dictionary});
  }

  /**
   * Перевод.
   * Если словарь ещё не подгружен, то инициируется его загрузка, а в качестве перевода
   * вернется option.fall или перевод из базового словаря, если тот уже загружен.
   * В режиме suspense при ожидании загрузки словаря будет выброшено исключением с промисом
   * @param key Код фразы для перевода - путь в словаре, например "basket.article.label". Путь начинается с названия словаря.
   * @param options Опции перевода.
   */
  translate = <L extends TLocale>(
    key: TTranslationKey,
    options?: ITranslateOptions<L>
  ) => {
    const {
      plural,
      suspense = true,
      locale = this.state.locale as L,
      values = {}
    } = options || {};

    // Добавление в окончание кода счисления (.zero .one .two .few .many .other)
    if (plural !== undefined) key += `.${new Intl.PluralRules(locale).select(plural)}` as TTranslationKey;
    // Название словаря
    const namespace = key.split('.').shift() as TLocaleNamespace<L>;

    // Попытка загрузить словарь (если ещё не загружался)? (Но не ждём загрузку)
    if (this.load(locale, namespace, suspense)) {
      // Словарь грузится асинхронно, поэтому перевода может ещё не быть
      if (key in this.state.dictionary[locale]) {
        return this.replace(this.state.dictionary[locale][key], values);
      }
    }
    // Если нет ожидания загрузки словаря, то используется общий словарь
    if (!this.services.suspense.waiting(`${locale}.${namespace}`) && locale !== '*') {
      if (this.load('*', namespace as TLocaleNamespace<'*'>, suspense)) {
        if (key in this.state.dictionary['*']) {
          return this.replace(this.state.dictionary['*'][key], values);
        }
      }
    }
    // Заглушка если нет перевода или словарь в ожидании загрузки
    if (options && typeof options.fall !== 'undefined') {
      return this.replace(options.fall, values);
    }
    // если ничего нет, то переводом будет ключ словаря
    return key;
  };

  /**
   * Форматирование числа с учётом локали и других параметров.
   * Используется Intl.NumberFormat()
   * @param value Число
   * @param [options] Опции форматирования
   */
  number = (value: number, options: INumberOptions = {}) => {
    const {
      locale = this.state.locale as TLocaleReal
    } = options || {};
    return new Intl.NumberFormat(locale, options).format(value);
  };

  /**
   * Шаблонизация строки - вставка значений в именованные области.
   * Используется в функции translate если передана опция values
   * @param template
   * @param values
   */
  replace(template: string, values: Record<string, string | number> = {}) {
    let result = template;
    for (const [name, value] of Object.entries(values)) {
      result = result.replace(`{{${name}}}`, value as string);
    }
    return result;
  };

  /**
   * Загрузка словаря по названию и локали.
   * Вызывается функцией translate
   * Словарь должен быть прописан в файле imports.ts функцией динамического импорта,
   * либо непосредственно объектом с переводами.
   * В режиме suspense в случаи ожидания загрузки будет выброшено исключение с промисом.
   * Без suspense функция вернет false
   * Если словарь уже загружен, то вернется true.
   * Даже синхронно подключенные словари (не требующие самой ожидания загрузки) устанавливаются в
   * состояние асинхронно (следующим микротаском).
   * @param locale Локаль словаря
   * @param namespace Название словаря
   * @param suspense Выбросить исключение для реализации ожидания компонентом <Suspense>
   * @param onLoad Функция обратного вызова после окончания загрузки
   */
  load<Locale extends TLocale>(
    locale: Locale,
    namespace: TLocaleNamespace<Locale>,
    suspense = false,
    onLoad?: () => void
  ): boolean {
    const key = `${locale}.${namespace}`;
    // Если уже есть ожидание загрузки, то проверка её статуса
    if (this.services.suspense.has(key)) {
      // Если загрузка ещё не завершена
      if (this.services.suspense.waiting(key)) {
        if (suspense) this.services.suspense.throw(key); else return false;
      }
    } else {
      if (!this.state.dictionary[locale]) this.state.dictionary[locale] = {} as TTranslation;
      if (typeof dictionaries[locale][namespace] === 'function') {
        // Функция загрузки json словаря (Например как () => import('locale.json'))
        const dynamicImport = dictionaries[locale][namespace] as () => Promise<{ default: object }>;
        // Ожидание загрузки
        this.services.suspense.add(key, dynamicImport()).then(source => {
          this.setTranslations(locale, namespace, source.default);
          if (onLoad) onLoad();
        });
        if (suspense) this.services.suspense.throw(key); else return false;

      } else if (typeof dictionaries[locale][namespace] === 'object') {
        Promise.resolve().then(() => {
          this.services.suspense.complete(key);
          this.setTranslations(locale, namespace, dictionaries[locale][namespace] as object);
          if (onLoad) onLoad();
        });
      }
    }
    return true;
  }

  /**
   * Автоопределение локали по HTTP заголовку accept-language
   */
  detectLocale(){
    const accept = this.env.SSR && this.env.req
      ? this.env.req.headers['accept-language'] // на сервере
      : navigator.languages.join(','); // в браузере
    return acceptLang.pick(this.state.locales, accept, {loose: true});
  }

  /**
   * Восстановление локали из куки
   */
  restoreLocale(){
    if (this.env.SSR) {
      return this.env.req ? this.env.req.cookies['locale'] as TLocaleReal : undefined;
    } else {
      return cookie.get('locale') as TLocaleReal;
    }
  }

  /**
   * Запоминание локали
   * @param locale
   */
  rememberLocale(locale: TLocaleReal){
    if (!this.env.SSR) {
      cookie.set('locale', locale, {expires: 30});
    }
  }

  setDependencies(locale: TLocaleReal){
    this.services.api.setHeader('X-Lang', locale);
  }
}

export default I18nService;
