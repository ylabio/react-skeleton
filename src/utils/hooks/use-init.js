import { useEffect } from 'react';

/**
 * Хук для асинхронных расчётов, которые будут исполнены первом рендере или изменнии inputs.
 * Так же вызывается при SSR. Если callback асинхронный, то ожидается его исполнение перед
 * серверным рендером.
 * @param callback {Function}
 * @param inputs {Array}
 * @param onBackForward {Boolean}
 */
export default function useInit(callback, inputs = [], onBackForward = false) {
  if (process.env.IS_NODE && global.SSR_FIRST_RENDER) {
    // При серверном рендере исполняем рдин раз
    const promise = callback(true);
    global.pushInitPromise(promise);
    return promise;
  } else {
    // На фронте используется хук эффекта по умолчанию один раз, если не переданы зависимости inputs
    useEffect(() => {
      // Не вызывать, если есть начальные данные от рендера на сервере
      if (!window.SSR_FIRST_RENDER) {
        callback(false);
      }
      if (onBackForward) {
        window.addEventListener('popstate', callback);
        return () => {
          window.removeEventListener('popstate', callback);
        };
      }
    }, inputs);
  }
}
