import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@src/utils/themes';
import './style.less';

interface Props {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  theme: string | string[];
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function Button(props: Props) {
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
      type={props.type}
      className={themes('Button', props.theme)}
      title={props.title}
      onClick={callbacks.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
  title: PropTypes.string,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
  theme: '',
};

export default React.memo(Button);
