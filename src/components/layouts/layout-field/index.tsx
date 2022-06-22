import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@src/utils/themes';

import './style.less';

interface Props {
  label?: React.ReactNode;
  input: React.ReactNode;
  error: React.ReactNode;
  theme: string | string[];
}

class LayoutField extends Component<Props> {
  static propTypes = {
    label: PropTypes.node,
    input: PropTypes.node,
    error: PropTypes.node,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    theme: '',
  };

  render() {
    const { label, input, error, theme } = this.props;

    return (
      <div className={themes('LayoutField', theme)}>
        <div className="LayoutField__label">{label}</div>
        <div className="LayoutField__input">
          <div className="LayoutField__input-inner">{input}</div>
          <div className="LayoutField__error">{error}</div>
        </div>
      </div>
    );
  }
}

export default LayoutField;
