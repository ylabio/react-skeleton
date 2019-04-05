import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './style.less';

class Logo extends Component {
  static propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
  };

  static defaultProps = {
    to: '/',
    title: '',
  };

  render() {
    const { to, title } = this.props;

    return (
      <Link className={styles.Logo} to={to} title={title}>
        Skeleton
      </Link>
    );
  }
}

export default Logo;
