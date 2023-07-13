import {memo} from 'react';
import * as modalsComponents from '@src/modals/imports';
import useServices from '@src/utils/hooks/use-services';
import useObservable from "@src/utils/hooks/use-observable";

/**
 * Отображает все открытье модальные окна
 */
function ModalsContainer() {
  const modalsStack = useObservable(useServices().modals, state => state);
  return <>{modalsStack.map(state => {
    const Component = modalsComponents[state.name];
    // Почему-то state.props не сопоставляется с компонентом модалки. Поэтому применён any
    return <Component key={state.key} {...state.props as any}/>;
  })}</>;
}

export default memo(ModalsContainer);
