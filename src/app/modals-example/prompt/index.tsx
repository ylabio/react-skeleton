import {memo, ReactNode, useCallback, useState} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/features/modals/types";
import SideLayout from "@src/ui/layout/side-layout";

interface PropsConfirmModal extends ModalClose<string | null> {
  title: string;
  message: string;
}

function PromptModal(props: PropsConfirmModal): ReactNode {

  const [value, setValue] = useState('');

  const callbacks = {
    onSuccess: useCallback(() => props.close(value), [value]),
    onCancel: useCallback(() => props.close(null), []),
  };

  return (
    <ModalLayout onClose={callbacks.onCancel}>
      <h2>{props.title}</h2>
      <p>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
      </p>
      <p>{props.message}</p>
      <SideLayout side="end">
        <button onClick={callbacks.onSuccess}>Ок</button>
        <button onClick={callbacks.onCancel}>Отмена</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(PromptModal);
