import React, {Component} from 'react';
import {connect} from 'react-redux';
import "./style.less";
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {accountActions} from '../../store/actions';

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

  componentWillMount() {
    if (this.props.account.hasToken) {
      this.props.history.replace('/main');
    }
  }

  render() {
    return (
      <div className="Login">
        <div>
          <h1>Login page</h1>
          <Link to="/">На главную</Link>
        </div>
      </div>
    );
  }
}

export default connect(state=>({
  account: state.account,
  isLoading: state.account.loginWait
}))(Login);
