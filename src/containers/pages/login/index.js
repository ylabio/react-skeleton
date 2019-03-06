import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LayoutPage } from '@components/layouts';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';
import FormLogin from '@components/forms/form-login';
import * as actions from '@store/actions';

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    formLogin: PropTypes.object,
  };

  onChangeForm = data => {
    this.props.dispatch(actions.formLogin.change(data));
  };

  onSubmitForm = data => {
    const { dispatch, history } = this.props;

    dispatch(actions.formLogin.submit(data)).then(() => {
      history.replace('/main');
    });
  };

  render() {
    const { formLogin } = this.props;

    return (
      <LayoutPage header={<HeaderContainer />}>
        <LayoutContent>
          <div>
            <h1>Login page</h1>
            <FormLogin
              data={formLogin.data}
              errors={formLogin.errors}
              wait={formLogin.wait}
              onChange={this.onChangeForm}
              onSubmit={this.onSubmitForm}
            />
          </div>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default connect(state => ({
  formLogin: state.formLogin,
  session: state.session,
}))(Login);
