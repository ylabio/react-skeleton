import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './style.less';
import {themes} from '../../../utils';

export default class Accordion extends Component {

  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    title: PropTypes.node,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    disabled: PropTypes.bool
  };

  static defaultProps = {
    disabled: false,
    theme: 'default'
  };

  handleClick = () => {
    this.setState({
      isOpen: this.props.disabled ? this.state.isOpen : !this.state.isOpen
    });
  };

  state = {
    isOpen: true
  };

  render() {
    const {theme, title, children, disabled} = this.props;
    return (
      <div
        className={cn(`Accordion`, themes('Accordion', theme))}
        onClick={this.onClick}
        disabled={disabled}
      >
        <div
          className={cn('Accordion__header', themes('Accordion__header', theme))}
          onClick={this.handleClick}
        >
          <div className={'Accordion__title'}>{title}</div>
        </div>

        <div className={cn('Accordion__collapse', {"Accordion__collapse_open": this.state.isOpen})}>
          <div className={'Accordion__body'}>
            {children}
          </div>
        </div>
      </div>
    );
  }

}
