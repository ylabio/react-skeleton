import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {modalActions} from "../../store/actions";
import Button from "../../components/elements/button";
import LayoutPage from "../../components/layouts/layout-page";

class Home extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  showInfo = () => {
    this.props.dispatch(modalActions.open('info')).then(result => {
      console.log(result);
    });
  };

  render() {
    return (
      <LayoutPage>
        <h1>Главная страница</h1>
        <Link to="/main">Внутренний раздел</Link>
        <div>
          <Button onClick={this.showInfo}>Показать модалку</Button>
        </div>
      </LayoutPage>
    );
  }
}

export default connect(state => ({}))(Home);
