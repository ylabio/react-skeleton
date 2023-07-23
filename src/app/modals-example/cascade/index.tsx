import {memo, ReactNode, useCallback} from 'react';
import ModalLayout from "@src/ui/layout/modal-layout";
import {ModalClose} from "@src/features/modals/types";
import SideLayout from "@src/ui/layout/side-layout";
import useServices from "@src/services/use-services";
import {useTranslate} from "@src/features/i18n/use-i18n";

interface PropsCascadeModal extends ModalClose<void> {
  title: string;
  message: string;
  level?: number;
}

function CascadeModal(props: PropsCascadeModal): ReactNode {
  const t = useTranslate();
  const {level = 1} = props;
  const modals = useServices().modals;
  const openCascade = useCallback(() => {
    modals.open('cascade', {
      title: t('common.modals.cascade.title'),
      message: t('common.modals.cascade.message', {plural: level+1, values: {count: level+1}}),
      level: level+1
    });
  }, [level, t]);

  return (
    <ModalLayout onClose={props.close}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <p>
        <button onClick={openCascade}>{t('common.modals.cascade.openMore')}</button>
      </p>
      <SideLayout side="end">
        <button onClick={() => props.close()}>{t('common.modals.ok')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(CascadeModal);
