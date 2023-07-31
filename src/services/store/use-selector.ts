import useServices from "@src/services/use-services";
import {useCallback, useEffect, useState} from "react";
import shallowequal from "shallowequal";
import {TStoreModuleName, TStoreModulesState} from "@src/services/store/types";

/**
 * Хук для выборки данных из store и подписки на их изменения.
 * При возможности используйте хук useStoreState, чтобы выбирать состояние из конкретного модуля.
 * @param selector Функция для выборки нужных данных из state
 * @return Выбранные данные функцией selector
 */
export default function useSelector<Result>(selector: (state: TStoreModulesState) => Result): Result {
  const store = useServices().store;

  const [result, setResult] = useState(() => selector(store.dump()));

  const subscribe = useCallback(() => {
    const listener = () => {
      const newResult = selector(store.dump());
      setResult((prevResult) => {
        return shallowequal(prevResult, newResult) ? prevResult : newResult;
      });
    };
    // Необходимо подписаться на все модули состояния, так как данные в селекторе выбираются из всех модулей
    const unsubscribes : (() => void)[] = [];
    const keys = Object.keys(store.modules) as TStoreModuleName[];
    for (const key of keys) {
      unsubscribes.push(store.modules[key].subscribe(listener));
    }
    // Возвращается отписка от всех модулей
    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
  }, []);

  useEffect(() => subscribe(), [subscribe]);
  return result;
}
