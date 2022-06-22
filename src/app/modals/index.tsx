import React, { useCallback } from 'react';
import * as allModals from './export';
import useSelector from '@src/utils/hooks/use-selector';
import useServices from '@src/utils/hooks/use-services';

//@TODO: set correct tpyes
const modals: any = allModals;

function Modals() {
  const select: any = useSelector((state: any) => ({
    modals: state.modals,
  }));

  const services = useServices();

  const callbacks = {
    /**
     * Выбор компонента окна, если нужно показывать
     * @returns {null|*}
     */
    getModal: useCallback(() => {
      const props = {
        ...select.modals?.params,
        close: (result: any) => {
          return services.store.modals.close(result);
        },
      };
      if (select.modals?.show) {
        if (modals[select.modals?.name]) {
          const Component = modals[select.modals?.name];
          return <Component {...props} />;
        }
      }

      return null;
    }, [select]),
  };

  return callbacks.getModal();
}

export default React.memo(Modals);
