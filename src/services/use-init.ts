import {useEffect} from 'react';
import useServices from '@src/services/use-services';
import isPromise from "@src/utils/is-promise";

/**
 * Хук для асинхронной инициализации
 * По умолчанию исполняется при первом рендере или изменении зависимостей deps.
 * На сервере используется логика Suspense для ожидания fn, это значит fn будет вызвана сразу и выбросит исключение,
 * если окажется асинхронной.
 * На клиенте fn выполнится в хуке useEffect, т.е. после рендера. На клиенте не используется suspense,
 * так как не решен полностью вопрос идентификации промисов.
 * (Для ssr хук ожидает строковый код действия, по которому идентифицируется промис)
 * @param fn Асинхронная пользовательская функция
 * @param deps Значения, при смене которых fn снова исполнится.
 * @param options Опции выполнения fn
 */
export default function useInit(
  fn: TInitFunction,
  deps: unknown[] = [],
  options: TInitOptions = {},
) {

  // Suspense используется только на сервере для ожидания инициализации перед рендером
  const suspense = useServices().suspense;
  if (suspense.env.SSR && options.ssr) {
    if (suspense.has(options.ssr)) {
      if (suspense.waiting(options.ssr)) {
        // Ожидание инициализации на логике Suspense (ожидание обработкой исключения)
        suspense.throw(options.ssr);
      }
    } else {
      try {
        // Инициализация ещё не выполнялась
        const result = fn();
        if (isPromise(result)) suspense.add(options.ssr, result);
      } catch (e) {
        console.error(e);
      }
      suspense.throw(options.ssr);
    }
  }

  // Хук работает только в браузере.
  useEffect(() => {
    // Функция выполняется, если не было инициализации на сервере или требуется перезагрузка
    if (!options.ssr || !suspense.has(options.ssr) || options.force) {
      fn();
    } else {
      // Удаляем инициализацию от ssr, чтобы при последующих рендерах fn() работала
      if (options.ssr) suspense.delete(options.ssr);
    }
  }, deps);
}

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
