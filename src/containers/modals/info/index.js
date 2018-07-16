import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';
import {Button} from '../../../components/elements';
import {LayoutModal} from "../../../components/layouts";

class Info extends Component {

  onCancel = () => {
    this.props.dispatch(actions.modal.close(false));
  };

  onSuccess = () => {
    this.props.dispatch(actions.modal.close(true));
  };

  renderFooter(){
    return (
      <Fragment>
        <Button onClick={this.onSuccess}>
          Всё понятно
        </Button>
      </Fragment>
    );
  }

  render() {
    return (
      <LayoutModal  onClose={this.onCancel} footer={this.renderFooter()}>
        Модальное окно
      </LayoutModal>
    );
  }
}

export default connect(state => ({}))(Info);
