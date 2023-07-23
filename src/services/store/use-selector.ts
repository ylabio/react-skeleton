import useServices from "@src/services/use-services";
import useObservable from "@src/utils/observable/use-observable";
import { TStoreState } from "@src/services/store/types";

/**
 * Хук для выборки данных из store
 * @param selector Функция для выборки только нужных данных и отслеживания их изменения
 * @return Выбранные данные функцией selector
 */
export default function useSelector<Result>(selector: (state: TStoreState) => Result): Result {
  return useObservable(useServices().store, selector);
}
