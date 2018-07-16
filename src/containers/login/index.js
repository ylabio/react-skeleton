import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {LayoutPage} from "../../components/layouts";
import LayoutContent from "../../components/layouts/layout-content";
import HeaderContainer from "../header-container";
import FormLogin from "../../components/forms/form-login";
import * as actions from "../../store/actions";

class Login extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    formLogin: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // if (this.props.session.exists) {
    //   this.props.history.replace('/main');
    // }
  }

  onChangeForm = (data) => {
    this.props.dispatch(actions.formLogin.change(data));
  };

  onSubmitForm = (data) => {
    this.props.dispatch(actions.formLogin.submit(data)).then(() => {
      this.props.history.replace('/main');
    });
  };

  render() {
    return (
      <LayoutPage header={<HeaderContainer/>}>
        <LayoutContent>
          <div>
            <h1>Login page</h1>
            <FormLogin
              data={this.props.formLogin.data}
              errors={this.props.formLogin.errors}
              wait={this.props.formLogin.wait}
              onChange={this.onChangeForm}
              onSubmit={this.onSubmitForm}/>
          </div>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default connect(state => ({
  formLogin: state.formLogin,
  session: state.session
}))(Login);
