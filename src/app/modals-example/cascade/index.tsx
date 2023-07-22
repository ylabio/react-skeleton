import {memo, ReactNode, useCallback} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/modals/types";
import SideLayout from "@src/ui/layout/side-layout";
import useServices from "@src/utils/hooks/use-services";
import plural from "@src/utils/plural";

interface PropsCascadeModal extends ModalClose<void> {
  title: string;
  message: string;
  level?: number;
}

function CascadeModal(props: PropsCascadeModal): ReactNode {
  const {level = 1} = props;
  const modals = useServices().modals;
  const openCascade = useCallback(() => {
    modals.open('cascade', {
      title: 'Каскад окон',
      message: `Открыто ${level+1} ${plural(level+1, {one: 'окно', few: 'окна', many:'окон'})}. Откройте ещё одно окно, при этом текущее не будет закрыто`,
      level: level+1
    });
  }, [level]);

  return (
    <ModalLayout onClose={props.close}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <p>
        <button onClick={openCascade}>Открыть ещё</button>
      </p>
      <SideLayout side="end">
        <button onClick={() => props.close()}>Ок</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(CascadeModal);
