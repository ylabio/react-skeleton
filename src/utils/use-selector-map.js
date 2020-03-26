import { useSelector, shallowEqual } from 'react-redux';

/**
 * Хук для выборки множества свойств из redux store в виде объекта
 * На изменения проверяются свойства первого уровня, если не передана кастомная функция сверки
 * @param selector Функция-селектор, возвращает объект свойств из store
 * @param isEqual Кастомная функция сверки. Опционально
 */
export default function useSelectorMap(selector, isEqual) {
  return useSelector(selector, isEqual || shallowEqual);
}
