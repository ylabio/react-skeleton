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

  onClick = (e) => {
    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick();
    }
  };

  // Блок Block: b
  // Модификаторы блока Block_mod: b._()
  // Разные значения модификаторов блока Block_mod_val
  // Элменты блока Block__elem
  // Модификаторы элементов Block__elem_mod
  // Значения модификаторов элемента Block__elem_mod_val

  render() {
    const {theme, href, title} = this.props;
    return (
      <a
        type="button"
        className={cn(`Button`, themeClasses('Button_theme_', theme))}
        title={title}
        href={href || '#'}
        onClick={this.onClick}
      >
        {this.props.children}
      </a>
    );
  }
}
