import React, { useCallback } from 'react';
import { bem } from '@src/utils/bem';
import './style.less';
import { ButtonProps } from './type';

function Button({ type = 'button', disabled = false, theme = '', ...props }: ButtonProps) {
  const cn = bem('Button');

  const callbacks = {
    onClick: useCallback(
      (e: React.SyntheticEvent) => {
        if (props.onClick) {
          e.preventDefault();
          props.onClick();
        }
      },
      [props.onClick],
    ),
  };

  return (
    <button
      type={type}
      className={cn({theme: theme})}
      title={props.title}
      onClick={callbacks.onClick}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
}

export default React.memo(Button);
