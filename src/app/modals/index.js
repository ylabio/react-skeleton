import React, {Component} from 'react';
import * as actions from '@store/actions';
import * as modals from './config.js';
import useSelectorMap from "@utils/use-selector-map";
import useCallbackMap from "@utils/use-callback-map";

const Modals = React.memo((props) => {

  const select = useSelectorMap(state => ({
    modal: state.modal
  }));

  const callbacks = useCallbackMap({
    /**
     * Выбор компонента окна, если нужно показывать
     * @returns {null|*}
     */
    getModal: () => {
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
    },

  }, [select]);

  return callbacks.getModal();
});

export default Modals;
