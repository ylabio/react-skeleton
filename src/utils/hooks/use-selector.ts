// import React, {useEffect, useMemo, useRef, useState} from "react";
// import shallowequal from 'shallowequal';
// import useServices from "@src/utils/hooks/use-services";
// import { IRootState } from "@src/services/store/types";
// import StoreService from "@src/services/store";

// /**
//  * Хук для выборки данных из store
//  * @param selector {Function}
//  * @return {unknown}
//  */
// export default function useSelector<T>(selector: (state: IRootState) => T): T {
//   const store = useServices().store;
//   const [state, setState] = useState(() => selector(store.getState()));
//   const unsubscribe = useMemo(() => {
//     return store.subscribe(() => {
//       const newState: T = selector(store.getState());
//       setState((prevState: T)  => {
//         return shallowequal(prevState, newState) ? prevState : newState;
//       })
//     })
//   }, [])
//   useEffect(() => unsubscribe, [unsubscribe])
//   return state;
// }
