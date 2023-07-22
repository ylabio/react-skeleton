import {memo, ReactNode, useCallback} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/modals/types";
import SideLayout from "@src/ui/layout/side-layout";

interface PropsConfirmModal extends ModalClose<boolean> {
  title: string;
  message: string;
}

function ConfirmModal(props: PropsConfirmModal): ReactNode {

  const callbacks = {
    onSuccess: useCallback(() => props.close(true), []),
    onCancel: useCallback(() => props.close(false), []),
  };

  return (
    <ModalLayout onClose={callbacks.onCancel}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={callbacks.onSuccess}>Ок</button>
        <button onClick={callbacks.onCancel}>Отмена</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(ConfirmModal);
