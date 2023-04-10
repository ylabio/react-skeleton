import React, {useEffect, useRef} from "react";
import shallowequal from 'shallowequal';
import useServices from "@src/utils/hooks/use-services";
import { IRootState } from "@src/services/store";

/**
 * Хук для выборки данных из store
 * @param selector {Function}
 * @return {unknown}
 */
export default function useSelector<T>(selector: (state: IRootState) => T): T {

  const store = useServices().store;
  const select = useRef(selector(store.getState()));
  const redraw = React.useState({})[1];

  useEffect(() => {
    // Подписка на последующие изменения в store
    return store.subscribe(() => {
      // Новая выборка
      const result = selector(store.getState());
      // Сравнение с предыдущей выборкой
      if (!shallowequal(select.current, result)) {
        select.current = result;
        // Заставляем компонент перерендериться, чтобы его useSelector взял новую выборку.
        redraw({});
      }
    });
  }, []);

  return select.current;
}
