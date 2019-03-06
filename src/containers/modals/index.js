import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '@store/actions';
import * as modals from './config.js';

class Modals extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    modal: PropTypes.object.isRequired,
  };

  getModal() {
    const { dispatch, history, modal } = this.props;

    const props = {
      ...modal.params,
      history,
      close: result => {
        dispatch(actions.modal.close(result));
      },
    };

    if (modal.show) {
      if (!(modal.params && modal.params.noOverflow)) {
        this.hideBodyOverflow();
      }
      if (modals[modal.name]) {
        const Component = modals[modal.name];
        return <Component {...props} />;
      }
    } else {
      this.resetBodyOverflow();
    }

    return null;
  }

  hideBodyOverflow() {
    if (document.body.style.overflow !== 'hidden') {
      //document.body.style.overflow = 'hidden';
    }
  }

  resetBodyOverflow() {
    if (document.body.style.overflow === 'hidden') {
      //document.body.style.overflow = '';
    }
  }

  render() {
    return this.getModal();
  }
}

export default connect(state => ({
  modal: state.modal,
}))(Modals);
