import { useEffect } from "react";

let cache = new Map() as Map<any, {promise: Promise<string | void>, waiting: boolean, timeout?: ReturnType<typeof setTimeout>}>;

/**
 * Хук для ожидания асинхронных расчётов, которые будут исполнены при первом рендере или изменении deps.
 * @param callback {Function} Пользовательская функция
 * @param deps {Array} Значения для кеширования по ключу при смене которого callback снова исполнится. (Первое значение рекомендуем брать уникальное)
 */
export default function useSuspense(callback: Function, deps: [string, ...unknown[]]) {
  const key = JSON.stringify(deps);
  if (!cache.has(key)) {
    cache.set(key, {
      promise: callback(),
      waiting: true,
      timeout: undefined,
    });
    //Проверяем что переданный callback являеться промисом
    if (cache.get(key)!.promise instanceof Promise) {
      let cacheData = cache.get(key)!;
      cacheData.promise.then(() => {
        cacheData.waiting = false;
        //Создаём таймер на удаление кеша на слуйчай если пользователь уйдёт со страницы раньше чем отработает промис
        cacheData.timeout = setTimeout(() => cache.delete(key), 0);
      });
      cache.set(key, cacheData);
    }
  }
  //Сработает в случае ожидания промиса и если callback вернул промис
  if (cache.get(key)?.waiting && cache.get(key)?.promise) {
    throw cache.get(key)?.promise;
  }
  useEffect(() => {
    //Сбрасываем таймер, если он есть, на удаление кеша
    if(cache.get(key)?.timeout) clearTimeout(cache.get(key)?.timeout);
    return () => {
      //Чистим кеш по ключу при демонтаже
      cache.delete(key)
    };
  }, []);
}
