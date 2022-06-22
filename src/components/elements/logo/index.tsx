import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import themes from '@src/utils/themes';

import './style.less';

interface Props {
  to: string;
  title: string;
  theme?: string | string[];
}

class Logo extends Component<Props> {
  static propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    to: '/',
    title: '',
    theme: '',
  };

  render() {
    const { to, title } = this.props;

    return (
      <Link className={themes('Logo', this.props.theme)} to={to} title={title}>
        Skeleton
      </Link>
    );
  }
}

export default Logo;
