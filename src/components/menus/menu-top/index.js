import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import styles from './style.less';

class MenuTop extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        to: PropTypes.string,
        active: PropTypes.bool,
      }),
    ).isRequired,

    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {};

  render() {
    const { items } = this.props;

    return (
      <div className={styles.MenuTop}>
        <ul className={styles.MenuTop__list}>
          {items.map((item, index) => (
            <li
              key={index}
              className={cn(styles.MenuTop__item, item.active && styles.MenuTop__item_active)}
            >
              <Link to={item.to} className={styles.MenuTop__link}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MenuTop;
