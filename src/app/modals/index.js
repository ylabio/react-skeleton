import React, { useCallback } from 'react';
import * as modals from './export.js';
import useSelector from "@src/utils/hooks/use-selector";
import useServices from "@src/utils/hooks/use-services";

function Modals() {
  const select = useSelector(state => ({
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
        close: result => {
          return services.store.modals.close(result);
        },
      };
      if (select.modals?.show) {
        if (modals[select.modals?.name]) {
          const Component = modals[select.modals?.name];
          return <Component {...props} />;
        }
      } else {
        return null;
      }
    }, [select]),
  };

  return callbacks.getModal();
}

export default React.memo(Modals);
