import React, {Fragment} from 'react';
import * as actions from '@store/actions';
import Button from '@components/elements/button';
import LayoutModal from '@components/layouts/layout-modal';
import useCallbackMap from "@utils/use-callback-map";

const Info = React.memo((props) => {

  const callbacks = useCallbackMap({
    onCancel: async () => {
      await actions.modal.close('Cancel value');
    },
    onSuccess: async () => {
      await actions.modal.close('Success value');
    },
    renderFooter: () => {
      return (
        <Fragment>
          <Button onClick={callbacks.onSuccess}>Всё понятно</Button>
        </Fragment>
      );
    }
  });

  return (
    <LayoutModal
      onClose={callbacks.onCancel}
      footer={callbacks.renderFooter()}
      overflowTransparent={props.overflowTransparent}
      overflowClose={props.overflowClose}
    >
      Модальное окно
    </LayoutModal>
  );
});

export default Info;
