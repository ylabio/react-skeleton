import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Page1 from './page1';

class Main extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  };

  checkAccess() {
    const { history, session } = this.props;
    // Проверка прав пользователя
    if (!session.user._id) {
      history.replace('/login');
    }
  }

  componentDidMount() {
    this.checkAccess();
  }

  componentDidUpdate(prevProps) {
    if (this.props.session.user !== prevProps.session.user) {
      this.checkAccess();
    }
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/main" component={Page1} />
          <Route component={() => <div>Not found!</div>} />
        </Switch>
      </Fragment>
    );
  }
}

export default connect(state => ({
  session: state.session,
}))(Main);
