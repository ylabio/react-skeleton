import {useEffect, useMemo, useState} from "react";
import shallowequal from 'shallowequal';
import useServices from "@src/utils/hooks/use-services";
import { TStoreState } from "@src/services/store/types";

/**
 * Хук для выборки данных из store
 */
export default function useSelector<T>(selector: (state: TStoreState) => T): T {
  const store = useServices().store;
  const [state, setState] = useState(() => selector(store.getState()));
  const unsubscribe = useMemo(() => {
    return store.subscribe(() => {
      const newState: T = selector(store.getState());
      setState((prevState: T)  => {
        return shallowequal(prevState, newState) ? prevState : newState;
      });
    });
  }, []);
  useEffect(() => unsubscribe, [unsubscribe]);
  return state;
}
