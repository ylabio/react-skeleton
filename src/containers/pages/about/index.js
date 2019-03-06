import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LayoutPage from '@components/layouts/layout-page';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';

class About extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    return (
      <LayoutPage header={<HeaderContainer />}>
        <LayoutContent>
          <h1>О проекте</h1>
          <p>Скелет приложения на React с примерами компонент и навигацией</p>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default connect()(About);
