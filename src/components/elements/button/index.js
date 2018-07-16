import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './style.less';
import {themes} from '../../../utils';

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.string,
    title: PropTypes.string,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    disabled: PropTypes.bool
  };

  static defaultProps = {
    type: 'button',
    disabled: false,
    theme: ''
  };

  onClick = (e) => {
    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick();
    }
  };

  render() {
    const {theme, title, type, children, disabled} = this.props;
    return (
      <button
        type={type}
        className={cn(`Button`, themes('Button', theme))}
        title={title}
        onClick={this.onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
