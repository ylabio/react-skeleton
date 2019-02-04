import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Helmet from 'react-helmet';
import LayoutPage from '@components/layouts/layout-page';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';

class About extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  render() {
    return (
      <LayoutPage header={<HeaderContainer/>}>
        <Helmet>
          <title>About Page</title>
          <meta name="description" content="This is a proof of concept for React SSR"/>
        </Helmet>
        <LayoutContent>
          <h1>О проекте</h1>
          <p>
            Скелет приложения на React с примерами компонент и навигацией
          </p>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default withRouter(
  connect(state => ({}))(About)
);
