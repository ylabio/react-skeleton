import {useCallback, useMemo} from 'react';

/**
 * Хук для определения множества функций (обычно колбэков)
 * @param callbacks
 * @param input
 * @returns {*}
 */
export default function useCallbackMap(callbacks, input = []) {
  return useMemo(() => callbacks, input);
}
