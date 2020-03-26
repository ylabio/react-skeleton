import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@utils/themes';

import './style.less';

class Input extends Component {
  static propTypes = {
    value: PropTypes.node.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    focused: PropTypes.bool,
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    autocomplete: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    disabled: false,
    type: 'text',
  };

  onChange = e => {
    const { onChange } = this.props;

    const value = e.target.value;
    return onChange(value);
  };

  onFocus = e => this.props.onFocus(e);

  onBlur = () => this.props.onBlur();

  render() {
    const {
      type,
      placeholder,
      required,
      focused,
      value,
      theme,
      disabled,
      tabIndex,
      autocomplete,
    } = this.props;

    return (
      <div className={cn('Input', themes('Input', theme))}>
        <input
          className="Input__input"
          value={value}
          type={type}
          placeholder={placeholder}
          tabIndex={tabIndex}
          disabled={disabled}
          required={required}
          autoFocus={focused}
          autoComplete={autocomplete ? 'on' : 'off'}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

export default Input;
