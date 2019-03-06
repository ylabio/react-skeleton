import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './style.less';

class Icon extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    name: PropTypes.string,
    style: PropTypes.object,
    hover: PropTypes.bool,
    hoverText: PropTypes.string,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    onClick: () => {},
    isActive: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isHovered: null,
    };
  }

  componentDidMount() {
    if (this.props.hover) {
      this.setState({
        isHovered: false,
      });
    }
  }

  shouldComponentUpdate(nextState) {
    return nextState.isHovered !== this.state.isHovered;
  }

  onMouseOver = () => {
    if (this.state.isHovered !== null) {
      this.setState({
        isHovered: true,
      });
    }
  };

  onMouseLeave = () => {
    if (this.state.isHovered !== null) {
      this.setState({
        isHovered: false,
      });
    }
  };

  onClick = e => {
    const { onClick } = this.props;

    e.preventDefault();
    onClick();
  };

  render() {
    const { isHovered } = this.state;
    const { name, style, hoverText, isActive } = this.props;

    let iconClickedClass = cn({
      '-active': isHovered || isActive,
    });

    return (
      <i
        style={style}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        className={`Icon Icon_margin`}
      >
        <div className={`Icon_${name}${iconClickedClass} Icon_size`} />
        <div
          className={
            'Icon__tip-text_font-style Icon__tip-text_bg-color Icon__tip-text_position Icon__tip_text-size Icon__tip_text_color-gray Icon__tip-text_theme-arrowCenter'
          }
          style={
            isHovered !== null && isHovered ? { visibility: 'visible' } : { visibility: 'hidden' }
          }
        >
          {hoverText}
        </div>
      </i>
    );
  }
}

export default Icon;
