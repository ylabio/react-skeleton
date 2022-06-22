import React, { Fragment, useCallback } from 'react';
import Button from '@src/components/elements/button';
import LayoutModal from '@src/components/layouts/layout-modal';
import useServices from '@src/utils/hooks/use-services';

interface Props {
  overflowTransparent: boolean;
  overflowClose: boolean;
}

function Info(props: Props) {
  const services = useServices();

  const callbacks = {
    onCancel: useCallback(async () => {
      await services.store.modals.close('Cancel value');
    }, []),
    onSuccess: useCallback(async () => {
      await services.store.modals.close('Success value');
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
