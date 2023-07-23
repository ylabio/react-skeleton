import {memo, ReactNode} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/features/modals/types";
import SideLayout from "@src/ui/layout/side-layout";
import {useTranslate} from "@src/features/i18n/use-i18n";

interface PropsMessageModal extends ModalClose<void> {
  title: string;
  message: string;
}

function MessageModal(props: PropsMessageModal): ReactNode {
  const t = useTranslate();
  return (
    <ModalLayout onClose={props.close}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={() => props.close()}>{t('common.modals.ok')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(MessageModal);
