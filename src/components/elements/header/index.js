import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
    left: PropTypes.node,
    right: PropTypes.node,

    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };

  static defaultProps = {};

  render() {
    const {left, children, right, theme} = this.props;
    return (
      <div className="Header">
        <div className="Header__left">
          {left}
        </div>
        <div className="Header__center">
          {children}
        </div>
        <div className="Header__right">
          {right}
        </div>
      </div>
    );
  }
}
