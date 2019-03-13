import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutPage from '@components/layouts/layout-page';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';

class Main extends Component {
  render() {
    return (
      <LayoutPage header={<HeaderContainer />}>
        <LayoutContent>
          <h1>Page 1</h1>
          <p>Внутренняя страница для авторизованных</p>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default connect()(Main);
