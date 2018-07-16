import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import LayoutPage from "../../../components/layouts/layout-page";
import LayoutContent from "../../../components/layouts/layout-content";
import HeaderContainer from "../../header-container";

class Page1 extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  render() {
    return (
      <LayoutPage header={<HeaderContainer/>}>
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
  connect(state => ({

  }))(Page1)
);
