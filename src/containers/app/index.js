import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';
import {Route, Router, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';
import Modals from '../modals';
import routes from '../../routes';
import {objectUtils} from '../../utils';

import '../../theme/style.less';

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
            {objectUtils.objectToArray(routes).map(route => {
              return (
                <Route key={route.path} path={route.path} exact={route.exact} component={route.component}/>
              );
            })}
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
