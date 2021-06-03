import { useEffect } from 'react';
import services from '@src/services';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении inputs.
 * Так же вызывается при рендере на сервере с ожиданием исполнения асинхронного callback перед SSR.
 * @param callback {Function} Пользовательская функция
 * @param inputs {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward, force, ssr}}
 */
export default function useInit(callback, inputs = [], options = {onBackForward: false, force: false, ssr: null}) {
  // Рендер на сервере. Вместо хуки вызов кэлбэка если передан ключ ssr и с этим ключом ещё не вызывался
  if (services.env.IS_NODE) {
    if (options.ssr) return services.ssr.prepare(callback, options.ssr);
  } else {
    // На фронте используется хук эффекта по умолчанию один раз, если не переданы зависимости inputs
    useEffect(() => {
      // Исполняется если опция форсирования или нет начальных данных от SSR по ключу
      if (options.force || !services.ssr.hasPrepare(options.ssr)) {
        // Удаляем ключ ssr, чтобы при последующих рендерах хук работал
        services.ssr.deletePrepare(options.ssr);
        callback(false);
      }
      if (options.backForward) {
        window.addEventListener('popstate', callback);
        return () => {
          window.removeEventListener('popstate', callback);
        };
      }
    }, inputs);
  }
}
