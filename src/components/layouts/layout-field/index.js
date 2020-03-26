import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@utils/themes';

import './style.less';

class LayoutField extends Component {
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
      <div className={cn(`LayoutField`, themes('LayoutField', theme))}>
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
