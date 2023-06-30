import {useEffect} from 'react';
import useServices from '@src/utils/hooks/use-services';

export type TInitFunction = () => Promise<unknown> | unknown;

export type TInitOptions = {
  /**
   * Ключ для выполнения fn на сервере. Если не указан, то fn не выполняется при SSR.
   * Можно указать строку, например "Load articles".
   * По ключу на клиенте определяется, выполнялась ли инициализация на сервере.
   * Ключ также используется для логики Suspense
   */
  ssr?: string;
  /**
   * Перевыполнить fn на клиенте, если была выполнена инициализация на сервере.
   */
  force?: boolean;
  /**
   * Выполнять fn при переходе по истории навигации.
   * Используется, если нужно отреагировать на переход назад/вперед в браузере, а не на смену/установку параметров адреса.
   * Например, когда search-парметры адреса установлены напрямую
   */
  onBackForward?: boolean;
}

/**
 * Хук для асинхронной инициализации
 * По умолчанию исполняется при первом рендере или изменении зависимостей deps.
 * На сервере используется логика Suspense для ожидания fn
 * @param fn Асинхронная пользовательская функция
 * @param deps Значения, при смене которых fn снова исполнится.
 * @param options Опции выполнения fn
 */
export default function useInit(
  fn: TInitFunction,
  deps: unknown[] = [],
  options: TInitOptions = {},
) {

  const services = useServices();
  const suspense = services.suspense;

  if (suspense.enabled.useInit && options.ssr) {
    if (suspense.has(options.ssr)) {
      if (suspense.waiting(options.ssr)) {
        // Ожидание инициализации на логике Suspense (ожидание обработкой исключения)
        suspense.throw(options.ssr);
      }
    } else {
      try {
        // Инициализация ещё не выполнялась
        suspense.wait(options.ssr, fn());
      } catch (e) {
        console.error(e);
      }
      suspense.throw(options.ssr);
    }
  }

  useEffect(() => {
    // Хук работает на клиенте.
    // Функция выполняется, если выключен suspense для useInit, не было инициализации на сервере или требуется перезагрузка
    if (!suspense.enabled.useInit && (!options.ssr || !suspense.has(options.ssr) || options.force)) {
      fn();
    } else {
      // Удаляем инициализацию от ssr, чтобы при последующих рендерах хук работал
      if (options.ssr) suspense.delete(options.ssr);
    }
    // Если в истории браузера меняются только query-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (когда нужно отреагировать на изменения query-параметров при переходе по истории)
    if (options.onBackForward) {
      window.addEventListener('popstate', fn);
      return () => {
        window.removeEventListener('popstate', fn);
      };
    }
  }, deps);
}
