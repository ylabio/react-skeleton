import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@utils/themes';
import LayoutField from '@components/layouts/layout-field';
import Input from '@components/elements/input';
import Error from '@components/elements/error';
import Button from '@components/elements/button';

import './style.less';

class FormLogin extends Component {
  static propTypes = {
    data: PropTypes.shape({
      login: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }).isRequired,
    errors: PropTypes.any,
    wait: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    theme: ['default'],
    errors: {},
    onChange: () => {},
    onSubmit: () => {},
  };

  onChange = name => value => {
    const { data, onChange } = this.props;

    onChange({ ...data, [name]: value });
  };

  onSubmit = e => {
    const { data, onSubmit } = this.props;

    e.preventDefault();
    onSubmit({ ...data });
  };

  render() {
    const { data, errors, wait, theme } = this.props;

    return (
      <form className={cn(`FormLogin`, themes('FormLogin', theme))} onSubmit={this.onSubmit}>
        <LayoutField
          label={'Логин'}
          input={<Input type="text" value={data.login} onChange={this.onChange('login')} />}
          error={<Error errors={errors} path={'login'} />}
        />
        <LayoutField
          label={'Пароль'}
          input={
            <Input type="password" value={data.password} onChange={this.onChange('password')} />
          }
          error={<Error errors={errors} path={'password'} />}
        />
        <LayoutField
          input={
            <Button type="submit" disabled={wait}>
              Войти{wait && '...'}
            </Button>
          }
          error={<Error errors={errors} path={''} />}
        />
      </form>
    );
  }
}

export default FormLogin;
