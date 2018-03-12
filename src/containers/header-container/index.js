import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {modalActions} from "../../store/actions";
import {detectActive} from "../../utils";

import LayoutHeader from "../../components/layouts/layout-header";
import MenuTop from "../../components/menus/menu-top";
import Button from "../../components/elements/button";
import Logo from "../../components/elements/logo";


class HeaderContainer extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  constructor(props){
    super(props);
    this.state = {
      items: detectActive([
        {title:'Главная', to:'/', active: false},
        {title:'Страница', to:'/page', active: false}
      ], props.location)
    };
  }

  componentWillReceiveProps(nextProps){
    if (this.props.location !== nextProps.location) {
      this.setState({
        items: detectActive(this.state.items, nextProps.location)
      });
    }
  }

  onClickOrder = () => {
    this.props.dispatch(modalActions.open('OrderPhone')).then(result => {
      console.log(result);
    });
  };

  onClickLogin = () => {
    this.props.dispatch(modalActions.open('Login')).then(result => {
      console.log(result);
    });
  };

  renderLeft(){
    return (
      <Logo/>
    );
  }

  renderRight(){
    return [
      <Button key={1} theme={["clear-white", "margins"]} onClick={this.onClickLogin}>Вход</Button>,
    ];
  }

  render(){
    return (
      <LayoutHeader
        left={this.renderLeft()}
        right={this.renderRight()}
        center={<MenuTop items={this.state.items}/>}
      />
    );
  }
}

export default withRouter(connect(state => ({

}))(HeaderContainer));
