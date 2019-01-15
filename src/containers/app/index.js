import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';
import {Route, Router, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';

import "../../theme/style.less";

import Home from '../pages/home';
import About from '../pages/about';
import Main from '../pages/main';
import Login from '../pages/login';
import NotFound from '../pages/not-found';
import Modals from '../modals';

class App extends Component {

  static propTypes = {
    session: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
  }

  componentDidMount() {
    this.props.dispatch(actions.session.remind());
  }

  render() {
    // If checking token
    if (this.props.session.wait) {
      return (
        <Fragment>
          Загрузка...
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Router history={this.history}>
          <Switch>
            <Route path="/" exact={true} component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/login" component={Login}/>
            <Route path="/main" component={Main}/>
            <Route component={NotFound}/>
          </Switch>
        </Router>
        <Modals history={this.history}/>
      </Fragment>
    );
  }
}

export default connect(state => ({
  session: state.session
}))(App);
