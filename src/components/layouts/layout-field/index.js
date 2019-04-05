import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.less';

class LayoutField extends Component {
  static propTypes = {
    label: PropTypes.node,
    input: PropTypes.node,
    error: PropTypes.node,
  };

  render() {
    const { label, input, error } = this.props;

    return (
      <div className={styles.LayoutField}>
        <div className={styles.LayoutField__label}>{label}</div>
        <div className={styles.LayoutField__input}>
          <div className={styles['LayoutField__input-inner']}>{input}</div>
          <div className={styles.LayoutField__error}>{error}</div>
        </div>
      </div>
    );
  }
}

export default LayoutField;
