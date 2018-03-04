import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, Route, Router, Switch} from 'react-router-dom';

class Main extends Component {

  static propTypes = {
    account: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  checkAccess(account){
    if (!account.hasToken) {
      this.props.history.replace('/login');
    }
  }

  componentWillMount() {
    this.checkAccess(this.props.account);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.account.hasToken !== nextProps.account.hasToken) {
      this.checkAccess(nextProps.account);
    }
  }

  render() {
    return (
      <div className="Main">
        <Switch>
          {/*<Route exact path='/main/pag1' component={Page1}/>*/}
          {/*<Route exact path='/main/pag2' component={Page2}/>*/}
          <Route component={() => <div>Not found!</div>}/>
        </Switch>
      </div>
    );
  }
}

export default connect(state => ({
  account: state.account
}))(Main);
