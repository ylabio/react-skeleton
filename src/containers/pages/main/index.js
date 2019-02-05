import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router-dom';
import routes from '../../../routes';
import {objectUtils} from '../../../utils';

class Main extends Component {

  static propTypes = {
    session: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  checkAccess() {
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
          {objectUtils.objectToArray(routes.main.children).map(route => {
            return (
              <Route key={route.path} path={route.path} exact={route.exact} component={route.component}/>
            );
          })}
        </Switch>
      </Fragment>
    );
  }
}

export default connect(state => ({
  session: state.session
}))(Main);
