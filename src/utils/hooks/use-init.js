import { useEffect } from 'react';

/**
 * Хук для асинхронных расчётов, которые будут исполнены первом рендере или изменнии inputs.
 * Так же вызывается при SSR. Если callback асинхронный, то ожидается его исполнение перед
 * серверным рендером.
 * @param callback {Function}
 * @param inputs {Array}
 * @param onBackForward {Boolean}
 * @param force {Boolean} В любом случаи исполнять
 */
export default function useInit(callback, inputs = [], onBackForward = false, force = false) {
  if (process.env.IS_NODE && SSR.firstRender) {
    // При серверном рендере исполняем один раз
    const promise = callback(true);
    SSR.initPromises.push(promise);
    return promise;
  } else {
    // На фронте используется хук эффекта по умолчанию один раз, если не переданы зависимости inputs
    useEffect(() => {
      // Не вызывать, если есть начальные данные от рендера на сервере
      if (!SSR.firstRender || force) {
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
