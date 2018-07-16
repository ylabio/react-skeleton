import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import * as actions from "../../store/actions";
import {detectActive} from "../../utils";

import LayoutHeader from "../../components/layouts/layout-header";
import MenuTop from "../../components/menus/menu-top";
import Button from "../../components/elements/button";
import Logo from "../../components/elements/logo";


class HeaderContainer extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      items: detectActive([
        {title: 'Главная', to: '/', active: false},
        {title: 'О нас', to: '/about', active: false},
        {title: '404', to: '/some-page', active: false}
      ], props.location)
    };
  }

  componentDidUpdate(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({
        items: detectActive(this.state.items, nextProps.location)
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
    const items = [];
    if (this.props.session.exists) {
      items.push(
        <Button
          key={1} theme={["clear-white", "margins"]}
          onClick={this.onClickLogout}>Выход</Button>
      );
    } else {
      items.push(
        <Button
          key={1} theme={["clear-white", "margins"]}
          onClick={this.onClickLogin}>Вход</Button>
      );
    }
    return items;
  }

  render() {
    return (
      <LayoutHeader
        left={<Logo/>}
        right={this.renderRight()}
        center={<MenuTop items={this.state.items}/>}
      />
    );
  }
}

export default withRouter(connect(state => ({
  session: state.session
}))(HeaderContainer));
