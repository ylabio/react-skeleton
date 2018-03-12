import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './style.less';
import {Link} from 'react-router-dom';
import themeClasses from '../../../utils/theme-classes';

export default class Logo extends Component {

  static propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };

  static defaultProps = {
    to: '/',
    title: '',
    theme: ''
  };

  render() {
    const {to, theme, title} = this.props;
    return (
      <Link
        className={cn(`Logo`, themeClasses('Logo_', theme))}
        to={to}
        title={title}
      >
        Logo
      </Link>
    );
  }
}
