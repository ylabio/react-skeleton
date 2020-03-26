import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import LayoutContent from '../layout-content';
import themes from '@utils/themes';

import './style.less';

class LayoutHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
    left: PropTypes.node,
    right: PropTypes.node,
    center: PropTypes.node,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    theme: '',
  };

  render() {
    const { left, children, right, center, theme } = this.props;

    return (
      <div className={cn(`LayoutHeader`, themes('LayoutHeader', theme))}>
        <LayoutContent>
          <div className="LayoutHeader__wrap">
            <div className="LayoutHeader__left">{left}</div>
            <div className="LayoutHeader__center">{children || center}</div>
            <div className="LayoutHeader__right">{right}</div>
          </div>
        </LayoutContent>
      </div>
    );
  }
}

export default LayoutHeader;
