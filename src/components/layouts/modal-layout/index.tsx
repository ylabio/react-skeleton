import React, {memo, useEffect, useRef} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.less';

interface Props {
  children?: React.ReactNode,
  onClose?: () => void,
  overlayTransparent?: boolean,
  overlayClose?: boolean,
  buttonClose?: boolean,
  padding?: boolean,
  size?: 'small' | 'normal' | 'big'
}

function ModalLayout(props: Props) {
  const cn = bem('ModalLayout');
  const {
    overlayTransparent = false,
    overlayClose = false,
    buttonClose = true,
    padding = true,
    size = 'normal'
  } = props;

  // Корректировка центра, если модалка больше окна браузера.
  const overlay = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (overlay.current && frame.current) {
        // Центрирование frame или его прижатие к краю, если размеры больше чем у layout
        overlay.current.style.alignItems = (overlay.current.clientHeight < frame.current.clientHeight)
          ? 'flex-start'
          : 'center';
        overlay.current.style.justifyContent = (overlay.current.clientWidth < frame.current.clientWidth)
          ? 'flex-start'
          : 'center';
        // Анимация
        frame.current.style.transform = 'translate(0, 0)';
      }
    });
    if (overlay.current) {
      // Следим за изменениями размеров layout
      resizeObserver.observe(overlay.current);
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      resizeObserver.disconnect();
    };
  }, []);

  const callbacks = {
    onClose: () => {
      if (props.onClose) props.onClose();
    },
    /**
     * Закрытие окна при клике в серую область
     */
    onCloseOverlay: (e: React.SyntheticEvent<HTMLDivElement>) => {
      if (props.onClose && overlayClose && e.target === overlay.current) props.onClose();
    }
  };

  return (
    <div
      ref={overlay}
      onClick={callbacks.onCloseOverlay}
      className={cn({transparent: overlayTransparent})}>
      <div className={cn('frame', {size})} ref={frame}>
        <div className={cn('content', {padding})}>
          {buttonClose && <button className={cn('close')} onClick={callbacks.onClose}></button>}
          {props.children}
        </div>
      </div>
    </div>
  );
}


export default memo(ModalLayout);
