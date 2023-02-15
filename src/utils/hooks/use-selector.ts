import { useEffect, useMemo, useState } from "react";
import shallowequal from 'shallowequal';
import useServices from "@src/utils/hooks/use-services";
import { RootState } from "@src/services/store";

/**
 * Хук для выборки данных из store
 * @param selector {Function}
 * @return {RootState}
 */
export default function useSelector(selector: (state: RootState) => any): any{
  const store = useServices().store;
  const [state, setState] = useState(() => selector(store.getState()));
  const unsubscribe = useMemo(() => {
    return store.subscribe(() => {
      const newState: RootState = selector(store.getState());
      setState((prevState: RootState)  => {
        return shallowequal(prevState, newState) ? prevState : newState;
      })
    })
  }, [])
  useEffect(() => unsubscribe, [unsubscribe])
  return state;
}
