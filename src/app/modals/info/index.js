import React, { Fragment, useCallback } from 'react';
//import modal from '@src/store/modal/actions';
import Button from '@src/components/elements/button';
import LayoutModal from '@src/components/layouts/layout-modal';
import services from "@src/services";

function Info(props) {
  const callbacks = {
    onCancel: useCallback(async () => {
      await services.actions.modals.close('Cancel value');
    }, []),
    onSuccess: useCallback(async () => {
      await services.actions.modals.close('Success value');
    }, []),
    renderFooter: useCallback(() => {
      return (
        <Fragment>
          <Button onClick={callbacks.onSuccess}>Всё понятно</Button>
        </Fragment>
      );
    }, []),
  };

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
}

export default React.memo(Info);
