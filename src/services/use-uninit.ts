import {useEffect} from 'react';

/**
 * Хук для де инициализации при демонтировании компонента
 * Альтернатива useEffect, в которому нужно вернуть fn
 * @param fn Асинхронная пользовательская функция
 * @param deps Значения, при смене которых fn снова исполнится.
 */
export default function useUninit(
  fn: TUnitFunction,
  deps: unknown[] = [],
) {
  // Хук работает только в браузере.
  useEffect(() => {
    return () => {
      fn();
    };
  }, deps);
}

export type TUnitFunction = () => unknown;

