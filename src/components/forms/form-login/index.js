import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {themes} from '../../../utils';
import './style.less';
import LayoutField from "../../layouts/layout-field";
import Input from "../../elements/input";
import Error from "../../elements/error";
import Button from "../../elements/button";

export default class FormLogin extends Component {

  static propTypes = {
    data: PropTypes.shape({
      login: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired
    }).isRequired,
    errors: PropTypes.any,
    wait: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };

  static defaultProps = {
    theme: ['default'],
    errors: {},
    onChange: () => {
    },
    onSubmit: () => {
    },
  };

  onChange = name => {
    return (value) => {
      const data = {...this.props.data, [name]: value};
      this.props.onChange(data);
    };
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit({...this.props.data});
  };

  render() {
    const {data, errors, wait, theme} = this.props;
    return (
      <form className={cn(`FormLogin`, themes('FormLogin', theme))} onSubmit={this.onSubmit}>
        <LayoutField
          label={'Логин'}
          input={<Input type="text" value={data.login} onChange={this.onChange('login')}/>}
          error={<Error errors={errors} path={'login'}/>}>
        </LayoutField>
        <LayoutField
          label={"Пароль"}
          input={<Input type="password" value={data.password} onChange={this.onChange('password')}/>}
          error={<Error errors={errors} path={'password'}/>}>
        </LayoutField>
        <LayoutField
          input={<Button type="submit" disabled={wait}>Войти{wait && '...'}</Button>}
          error={<Error errors={errors} path={''}/>}>
        </LayoutField>
      </form>
    );
  }
}
