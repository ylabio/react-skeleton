import {useEffect} from 'react';

/**
 * Хук для асинхронных расчётов, которые будут исполнены первом рендере или изменнии inputs.
 * Так же вызывается при SSR. Если callback асинхронный, то ожидается его исполнение перед
 * серверным рендером.
 * @param callback(isSSR)
 * @param inputs
 */
export default function useActions(callback, inputs = []) {
  if (process.env.IS_NODE && global.SSR_FIRST_RENDER) {
    const promise = callback(true);
    global.pushInitPromise(promise);
    return promise;
  } else {
    useEffect(() => {
      if (!window.SSR_FIRST_RENDER){
        callback(false);
      }
    }, inputs);
  }
}
