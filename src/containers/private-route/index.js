/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';

class PrivateRoute extends Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
  };

  render() {
    const { session, component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          session.user && session.user._id ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )
  }
}

export default connect(
  state => ({
    session: state.session,
  }),
)(PrivateRoute);
