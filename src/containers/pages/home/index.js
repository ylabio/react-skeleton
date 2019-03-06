import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '@store/actions';
import Accordion from '@components/elements/accordion';
import Button from '@components/elements/button';
import LayoutPage from '@components/layouts/layout-page';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  showInfo = () => {
    this.props.dispatch(actions.modal.open('info')).then(result => {
      console.log(result);
    });
  };

  render() {
    return (
      <LayoutPage header={<HeaderContainer />}>
        <LayoutContent>
          <h1>Главная страница</h1>
          <p>
            <Link to="/main">Раздел для авторизованных</Link>
          </p>
          <p>
            <Button onClick={this.showInfo}>Показать модалку</Button>
          </p>
          <Accordion title={'Заголовок'}>
            text for accordion, with other components, ex. <Button>Button</Button>
          </Accordion>
        </LayoutContent>
      </LayoutPage>
    );
  }
}

export default connect()(Home);
