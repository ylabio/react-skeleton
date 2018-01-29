import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './style.less';

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

  themeClassNames(basename, theme) {
    const result = {};
    if (theme) {
      if (typeof theme === 'string') {
        result[basename + theme] = true;
      }
      if (Array.isArray(theme)) {
        for (const item of theme) {
          result[basename + item] = true;
        }
      }
    }
    return result;
  }

  render() {
    const {theme, href, title} = this.props;
    return (
      <a
        type="button"
        className={cn('Button', this.themeClassNames('Button_theme_', theme))}
        title={title}
        href={href || '#'}
        onClick={this.onClick}
      >
        {this.props.children}
      </a>
    );
  }
}
