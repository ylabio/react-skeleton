import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {themeClasses} from '../../../utils';
import './style.less';

export default class LayoutContent extends Component {

  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };

  static defaultProps = {
    theme:['default']
  };

  render() {
    const {children, theme} = this.props;
    return (
      <div className={cn(`LayoutContent`, themeClasses('LayoutContent_theme_', theme))}>
        {children}
      </div>
    );
  }
}