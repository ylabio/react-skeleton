import React, {Component} from 'react';
import {connect} from 'react-redux';
import {modalActions} from '../../../store/actions';
import {Button} from '../../../components/elements';
import {LayoutModal} from "../../../components/layouts";

class Info extends Component {

  onCancel = () => {
    this.props.dispatch(modalActions.close(false));
  };

  onSuccess = () => {
    this.props.dispatch(modalActions.close(true));
  };

  renderFooter(){
    return (
      <div>
        <Button onClick={this.onSuccess}>
          Всё понятно
        </Button>
      </div>
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
