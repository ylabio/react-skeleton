import {memo, ReactNode} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/modals/types";
import SideLayout from "@src/ui/layout/side-layout";

interface PropsMessageModal extends ModalClose<void> {
  title: string;
  message: string;
}

function MessageModal(props: PropsMessageModal): ReactNode {
  return (
    <ModalLayout onClose={props.close}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={() => props.close()}>Ок</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(MessageModal);
