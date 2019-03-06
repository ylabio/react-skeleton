import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '@store/actions';
import { detectActive } from '@utils';
import LayoutHeader from '@components/layouts/layout-header';
import MenuTop from '@components/menus/menu-top';
import Button from '@components/elements/button';
import Logo from '@components/elements/logo';

class HeaderContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      items: detectActive(
        [
          { title: 'Главная', to: '/', active: false },
          { title: 'О нас', to: '/about', active: false },
          { title: '404', to: '/some-page', active: false },
        ],
        props.location,
      ),
    };
  }

  componentDidUpdate(nextProps) {
    const { items } = this.state;
    const { location } = this.props;

    if (location !== nextProps.location) {
      this.setState({
        items: detectActive(items, nextProps.location),
      });
    }
  }

  onClickLogin = () => {
    this.props.history.push('/login');
  };

  onClickLogout = () => {
    this.props.dispatch(actions.session.clear());
  };

  renderRight() {
    const { session } = this.props;
    const items = [];

    if (session.exists) {
      items.push(
        <Button key={1} theme={['clear-white', 'margins']} onClick={this.onClickLogout}>
          Выход
        </Button>,
      );
    } else {
      items.push(
        <Button key={1} theme={['clear-white', 'margins']} onClick={this.onClickLogin}>
          Вход
        </Button>,
      );
    }
    return items;
  }

  render() {
    const { items } = this.state;

    return (
      <LayoutHeader left={<Logo />} right={this.renderRight()} center={<MenuTop items={items} />} />
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    session: state.session,
  })),
)(HeaderContainer);
