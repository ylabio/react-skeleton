import {memo, useSyncExternalStore} from 'react';
import * as modalsComponents from '@src/features/modals/imports';
import useServices from '@src/services/use-services';
/**
 * Отображает все открытье модальные окна
 */
function ModalsContainer() {
  const modals = useServices().modals;
  const modalsStack = useSyncExternalStore(modals.subscribe, modals.getState, modals.getState);
  return <>{modalsStack.map(state => {
    const Component = modalsComponents[state.name];
    // Почему-то state.props не сопоставляется с компонентом модалки. Поэтому применён any
    return <Component key={state.key} {...state.props as any}/>;
  })}</>;
}

export default memo(ModalsContainer);
