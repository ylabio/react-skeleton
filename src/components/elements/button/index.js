import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './style.less';
import {themeClasses} from '../../../utils';

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    href: PropTypes.string,
    title: PropTypes.string,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };

  static defaultProps = {
    onClick: () => {
    }
  };

  onClick = (e) => {
    e.preventDefault();
    this.props.onClick();
  };


  render() {
    const {theme, href, title} = this.props;
    return (
      <a
        type="button"
        className={cn('Button', themeClasses('Button_theme_', theme))}
        title={title}
        href={href || '#'}
        onClick={this.onClick}
      >
        {this.props.children}
      </a>
    );
  }
}
