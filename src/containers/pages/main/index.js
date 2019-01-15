import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Route, Router, Switch} from 'react-router-dom';

import Page1 from './page1';


class Main extends Component {

  static propTypes = {
    session: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  checkAccess(){
    // Проверка прав пользователя
    if (!this.props.session.user._id) {
      this.props.history.replace('/login');
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
          <Route exact path='/main' component={Page1}/>
          {/*<Route exact path='/main/pag2' component={Page2}/>*/}
          <Route component={() => <div>Not found!</div>}/>
        </Switch>
      </Fragment>
    );
  }
}

export default connect(state => ({
  session: state.session
}))(Main);
