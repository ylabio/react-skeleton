import {useRef} from 'react';
import {useLocation} from 'react-router-dom';

/**
 * Хук возвращает новое случайно значение, если location.state[name] === true
 * Используется при навигации на тот же путь и получения ключа, который можно применить
 * в других хуках в зависимостях, например, для перезагрузки данных.
 * @param name
 */
export default function useRefreshKey(name = 'refresh') {
  const location = useLocation();
  const key = useRef(0);
  // Если есть признак, то генерируем новое число
  if (location.state && location.state[name]) {
    key.current = Math.random();
  }
  return key.current;
}
