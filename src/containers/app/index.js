import React, {Component} from 'react';
import {connect} from 'react-redux';
import {accountActions} from '../../store/actions';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';

import "./style.less";

import Main from '../main';
import Login from '../login';

class App extends Component {

  static propTypes = {
    account: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.browserHistory = createBrowserHistory();
  }

  componentWillMount() {
    if (this.props.account.hasToken === null) {
      this.props.dispatch(
        accountActions.remind()
      );
    }
  }

  render() {
    // Is checking token
    if (this.props.account.hasToken === null) {
      return (
        <div className="App">
          Загрузка...
        </div>
      );
    }

    return (
      <div className="App">
        <Router history={this.browserHistory}>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/main" component={Main}/>
            {/*<Route path='/markup' component={SomePage}/>*/}
            <Redirect from='/' to='/main'/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(state => ({
  account: state.account
}))(App);