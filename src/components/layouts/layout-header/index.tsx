import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import LayoutContent from '../layout-content';
import themes from '@src/utils/themes';

import './style.less';

interface Props {
  theme?: string | string[];
  children?: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  center: React.ReactNode;
}

class LayoutHeader extends Component<Props> {
  static propTypes = {
    children: PropTypes.node,
    left: PropTypes.element,
    right: PropTypes.any,
    center: PropTypes.element,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    theme: '',
  };

  render() {
    const { left, children, right, center, theme } = this.props;

    return (
      <div className={themes('LayoutHeader', theme)}>
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
