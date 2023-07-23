import {useEffect} from "react";

/**
 * Реакция на переходы назад или в перёд по истории браузера
 * Используется, если нет реакции от react-router
 * @param fn Функция. вызываемая при переходах. Обычно та же функция, что в useInit
 * @param [deps] Зависимости, по умолчанию пустой массив - подписка при первом рендере
 */
export default function useBackForward(fn: () => void, deps = []){
  // Хук работает только в браузере.
  useEffect(() => {
    window.addEventListener('popstate', fn);
    return () => {
      window.removeEventListener('popstate', fn);
    };
  }, deps);
}
