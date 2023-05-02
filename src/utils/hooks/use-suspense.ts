import {useEffect} from "react";
import isPromise from "@src/utils/is-promise";

type TCacheData = {
  promise: Promise<unknown>,
  waiting: boolean,
  timeout?: ReturnType<typeof setTimeout>
}

let cache = new Map() as Map<string, TCacheData>;

/**
 * Хук для ожидания асинхронных расчётов, которые будут исполнены при первом рендере или изменении deps.
 * @param callback {Function} Пользовательская функция
 * @param deps {Array} Значения для идентификации useSuspense. Рекомендуется указывать описание действия и используемые параметры. Например: ['Load articles by category', categoryId]
 */
export default function useSuspense(callback: Function, deps: [string, ...unknown[]]) {
  if (deps.length === 0 || !deps[0]) {
    console.error('Укажите deps для идентификации useSuspense, например: useSuspense(callback, ["Load entity by id", id])');
  }
  const key = JSON.stringify(deps);
  let cacheData = cache.get(key);

  // Если нет записи в кэше, то выполняется callback и создаётся запись с соответствующим состоянием
  if (!cacheData) {
    cacheData = {
      promise: callback(),
      waiting: false, // По умолчанию ничего не ждем
      timeout: undefined,
    };
    //Если callback асинхронный (вернул Promise), то обрабатываем его завершение
    if (isPromise(cacheData.promise)) {
      cacheData.waiting = true; // Состояние ожидания пока promise не завершен
      cacheData.promise.then(() => {
        const cacheDataFresh = cache.get(key); // Снова смотрим в кэш, вдруг запись уже удалили
        if (cacheDataFresh) {
          cacheDataFresh.waiting = false;
          // Таймер для сброса кеша на случай отсутствия рендера после завершения промиса
          // Например, не дождавшись загрузки данных перешли на другую страницу
          cacheDataFresh.timeout = setTimeout(() => cache.delete(key), 10);
        }
      });
    }
    cache.set(key, cacheData);
  }

  // Если ожидаем завершение promise, то кидаем его в исключение для перехвата в <Suspense>
  if (cacheData.waiting) throw cacheData.promise;

  // Сбрасывание таймера удаления кэша, так как компонент успешно рендериться (кэш ещё нужен)
  if (cacheData.timeout) clearTimeout(cacheData.timeout);

  // Удаление записи в кэше при демонтаже react-элемента.
  useEffect(() => {
    return () => {
      console.log('delete cache', key);
      cache.delete(key);
    };
  }, []);
}
