import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import LayoutContent from '../layout-content';

import styles from './style.less';

class LayoutHeader extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    left: PropTypes.node,
    right: PropTypes.node,
    center: PropTypes.node,
  };

  render() {
    const { className, left, children, right, center } = this.props;

    return (
      <div className={cn(styles.LayoutHeader, className)}>
        <LayoutContent>
          <div className={styles.LayoutHeader__wrap}>
            <div className={styles.LayoutHeader__left}>{left}</div>
            <div className={styles.LayoutHeader__center}>{children || center}</div>
            <div className={styles.LayoutHeader__right}>{right}</div>
          </div>
        </LayoutContent>
      </div>
    );
  }
}

export default LayoutHeader;
