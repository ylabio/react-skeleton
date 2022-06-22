import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import * as allImages from './images';
import { cn } from '@bem-react/classname';
import './style.less';

const images: any[string] = allImages;

interface Props {
  name: string;
  hover: any;
  onClick: () => void;
}

function Icon({ name, hover, onClick }: Props) {
  if (!images[name]) {
    throw new Error(`Icon not found ${name}`);
  }

  const callbacks = {
    onClick: useCallback(
      (e: React.SyntheticEvent) => {
        e.stopPropagation();
        onClick();
      },
      [onClick],
    ),
  };

  const className = cn('Icon');

  return (
    <img src={images[name]} alt={''} className={className({ hover })} onClick={callbacks.onClick} />
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  height: PropTypes.any,
  width: PropTypes.any,
  hover: PropTypes.bool,
};

Icon.defaultProps = {
  onClick: () => {},
  height: '20px',
  width: 'auto',
  hover: true,
};

export default Icon;
