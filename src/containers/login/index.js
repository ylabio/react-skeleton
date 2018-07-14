import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {LayoutPage} from "../../components/layouts";
import LayoutContent from "../../components/layouts/layout-content";
import HeaderContainer from "../header-container";

class Login extends Component {

  static propTypes = {
    //login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.account.hasToken) {
      this.props.history.replace('/main');
    }
  }

  render() {
    return (
      <LayoutPage header={<HeaderContainer/>}>
        <LayoutContent>
          <div>
            <h1>Login page</h1>
            <Link to="/">На главную</Link>
          </div>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default connect(state => ({
  account: state.account,
  isLoading: state.account.loginWait
}))(Login);
