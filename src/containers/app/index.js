import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import PrivateRoute from '@containers/private-route';
import * as actions from '@store/actions';

import '../../theme/style.less';

import Home from '../pages/home';
import About from '../pages/about';
import Main from '../pages/main';
import Login from '../pages/login';
import NotFound from '../pages/not-found';
import Modals from '../modals';

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.history = createBrowserHistory();
  }

  componentDidMount() {
    this.props.dispatch(actions.session.remind());
  }

  render() {
    const { session } = this.props;
    // If checking token
    if (session.wait) {
      return <Fragment>Загрузка...</Fragment>;
    }

    return (
      <Fragment>
        <Router history={this.history}>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/main" component={Main} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Modals history={this.history} />
      </Fragment>
    );
  }
}

export default connect(state => ({
  session: state.session,
}))(App);
