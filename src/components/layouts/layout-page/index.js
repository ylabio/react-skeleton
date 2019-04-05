import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.less';

class LayoutPage extends Component {
  static propTypes = {
    header: PropTypes.node,
    content: PropTypes.node,
    footer: PropTypes.node,
    children: PropTypes.node,
  };

  render() {
    const { header, content, footer, children } = this.props;

    return (
      <div className={styles.LayoutPage}>
        <div className={styles.LayoutPage__header}>{header}</div>
        <div className={styles.LayoutPage__content}>{children || content}</div>
        <div className={styles.LayoutPage__footer}>{footer}</div>
      </div>
    );
  }
}

export default LayoutPage;
