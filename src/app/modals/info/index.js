import React, { Fragment, useCallback } from 'react';
import * as actions from '@store/actions';
import Button from '@components/elements/button';
import LayoutModal from '@components/layouts/layout-modal';

function Info(props) {
  const callbacks = {
    onCancel: useCallback(async () => {
      await actions.modal.close('Cancel value');
    }, []),
    onSuccess: useCallback(async () => {
      await actions.modal.close('Success value');
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
