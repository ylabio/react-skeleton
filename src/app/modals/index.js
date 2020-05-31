import React, { useCallback } from 'react';
import * as actions from '@store/actions';
import * as modals from './config.js';
import useSelectorMap from '@utils/hooks/use-selector-map';

function Modals() {
  const select = useSelectorMap(state => ({
    modal: state.modal,
  }));

  const callbacks = {
    /**
     * Выбор компонента окна, если нужно показывать
     * @returns {null|*}
     */
    getModal: useCallback(() => {
      const props = {
        ...select.modal.params,
        close: result => {
          actions.modal.close(result);
        },
      };
      if (select.modal.show) {
        if (modals[select.modal.name]) {
          const Component = modals[select.modal.name];
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
