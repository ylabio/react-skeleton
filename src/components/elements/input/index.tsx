import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@src/utils/themes';

import './style.less';

interface Props {
  value: any;
  theme?: string | string[];
  autocomplete?: boolean;
  focused?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  tabIndex?: number;
  type: string;
  onBlur?: () => void;
  onChange?: (value: any) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

class Input extends Component<Props> {
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
    onChange: (value: any) => {},
    onFocus: () => {},
    disabled: false,
    type: 'text',
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    const value = e.target.value;
    return onChange && onChange(value);
  };

  onFocus = (e: React.FocusEvent<HTMLInputElement>) => this.props.onFocus && this.props.onFocus(e);

  onBlur = () => this.props.onBlur && this.props.onBlur();

  render() {
    const { type, placeholder, required, focused, value, disabled, tabIndex, autocomplete } =
      this.props;

    return (
      <div className={themes('Input', this.props.theme)}>
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
