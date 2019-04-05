import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { themes } from '../../../utils';

import styles from './style.less';

class Accordion extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    title: PropTypes.node,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    theme: 'default',
  };

  state = {
    isOpen: true,
  };

  handleClick = () => {
    const { isOpen } = this.state;
    const { disabled } = this.props;

    this.setState({
      isOpen: disabled ? isOpen : !isOpen,
    });
  };

  render() {
    const { isOpen } = this.state;
    const { theme, title, children, disabled } = this.props;

    return (
      <div
        className={cn(styles.Accordion, styles[themes('Accordion', theme)])}
        onClick={this.onClick}
        disabled={disabled}
      >
        <div
          className={cn(styles.Accordion__header, styles[themes('Accordion__header', theme)])}
          onClick={this.handleClick}
        >
          <div className={styles.Accordion__title}>{title}</div>
        </div>

        <div className={cn(styles.Accordion__collapse, isOpen && styles.Accordion__collapse_open)}>
          <div className={styles.Accordion__body}>{children}</div>
        </div>
      </div>
    );
  }
}

export default Accordion;
