import React, { Component } from 'react';
import PropTypes from 'prop-types';
import list from './images';

class Icon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defualtProps = {
    className: undefined,
  };

  render() {
    const { name, className, ...rest } = this.props;

    if (!list[name]) {
      throw new Error(`Icon not found ${name}`);
    }

    const Element = list[name];

    return <Element className={className} {...rest} />;
  }
}

export default Icon;
