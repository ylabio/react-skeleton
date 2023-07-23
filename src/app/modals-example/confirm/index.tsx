import {memo, ReactNode, useCallback} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/features/modals/types";
import SideLayout from "@src/ui/layout/side-layout";
import {useTranslate} from "@src/features/i18n/use-i18n";

interface PropsConfirmModal extends ModalClose<boolean> {
  title: string;
  message: string;
}

function ConfirmModal(props: PropsConfirmModal): ReactNode {
  const t = useTranslate();
  const callbacks = {
    onSuccess: useCallback(() => props.close(true), []),
    onCancel: useCallback(() => props.close(false), []),
  };

  return (
    <ModalLayout onClose={callbacks.onCancel}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={callbacks.onSuccess}>{t('common.modals.ok')}</button>
        <button onClick={callbacks.onCancel}>{t('common.modals.cancel')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(ConfirmModal);
