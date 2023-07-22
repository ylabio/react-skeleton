import {useEffect, useMemo, useState} from "react";
import shallowequal from 'shallowequal';
import {IObservable} from "@src/utils/observable";

/**
 * Хук для выборки и подписки на изменения данных объекта, реализующего интерфейс наблюдателя
 * @param observer Объект с интерфейсом наблюдателя
 * @param selector Функция для выборки только нужных данных и отслеживания их изменения
 * @return Выбранные данные функцией selector
 */
export default function useObservable<Result, State>(
  observer: IObservable<State>,
  selector: (state: State) => Result
): Result {
  const [result, setResult] = useState(() => selector(observer.getState()));
  const unsubscribe = useMemo(() => {
    return observer.subscribe((state) => {
      const newResult = selector(state);
      setResult((prevResult) => {
        return shallowequal(prevResult, newResult) ? prevResult : newResult;
      });
    });
  }, []);
  useEffect(() => unsubscribe, [unsubscribe]);
  return result;
}
