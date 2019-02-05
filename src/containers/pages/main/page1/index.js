import React, {Component} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import LayoutPage from '@components/layouts/layout-page';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';

class Page1 extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  render() {
    return (
      <LayoutPage header={<HeaderContainer/>}>
        <Helmet>
          <title>Page 1</title>
          <meta name="description" content="This is a proof of concept for React SSR"/>
        </Helmet>
        <LayoutContent>
          <h1>Page 1</h1>
          <p>
            Внутренняя страница для авторизованных
          </p>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default withRouter(
  connect(state => ({}))(Page1)
);
