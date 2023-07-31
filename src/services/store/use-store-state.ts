import {useSyncExternalStore} from "react";
import useServices from "@src/services/use-services";
import {TStoreModuleKey, TStoreModuleName, TStoreModulesState} from "@src/services/store/types";

/**
 * Хук для выборки состояния модуля store
 * @params name Название модуля
 */
export default function useStoreState<StoreKey extends TStoreModuleKey<TStoreModuleName>>(name: StoreKey): TStoreModulesState[StoreKey] {
  const stateModule = useServices().store.modules[name];
  return useSyncExternalStore(
    stateModule.subscribe,
    stateModule.getState as () => TStoreModulesState[StoreKey],
    stateModule.getState as () => TStoreModulesState[StoreKey]
  );
}
