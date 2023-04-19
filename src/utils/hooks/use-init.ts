import { useEffect } from 'react';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении inputs.
 * Так же вызывается при рендере на сервере, добавляя ожидание асинхронного callback в сервис ssr.
 * @param callback {Function} Пользовательская функция
 * @param inputs {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward, ssrForce, ssr}}
 */

interface initOptions {
  onBackForward?: boolean;
  ssr: null | string;
  ssrForce?: boolean;
}

export default function useInit(
  callback: (ev: PopStateEvent | boolean) => void,
  inputs: any[] = [],
  options: initOptions = { onBackForward: false, ssr: null, ssrForce: false },
) {
  // Рендер на сервере.
  // На сервере вызов callback если передан ключ ssr и с этим ключом ещё не вызывался
  if (process.env.IS_NODE) {
    return callback(false);
  } else {
    // На клиенте используется хук эффекта по умолчанию один раз, если не переданы зависимости inputs
    useEffect(() => {
      // Если в истории браузера меняются только query-параметры, то react-router не оповестит
      // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
      // браузера (если нужно отреагировать на изменения query-параметров при переходе по истории)
      if (options.onBackForward) {
        window.addEventListener('popstate', callback);
        return () => {
          window.removeEventListener('popstate', callback);
        };
      }
    }, inputs);
  }
}
