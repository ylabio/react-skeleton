import * as api from '../../api';
import * as actions from '../actions';

export const types = {
  CHANGE: Symbol('UPDATE'),

  SUBMIT: Symbol('SUBMIT'),
  SUBMIT_SUCCESS: Symbol('SUBMIT_SUCCESS'),
  SUBMIT_FAILURE: Symbol('SUBMIT_FAILURE'),
};

export default {

  change: (data) => {
    return dispatch => {
      dispatch({
        type: types.CHANGE,
        payload: data,
      });
    };
  },

  submit: (data) => {
    return async dispatch => {
      dispatch({type: types.SUBMIT});

      try {
        const response = await api.users.login(data);
        const result = response.data.result;
        // Установка и сохранение сессии
        await dispatch(actions.session.save({user: result.user, token: result.token}));

        dispatch({type: types.SUBMIT_SUCCESS, payload: result.user});
        return result;
      } catch (e) {
        if (e.response && e.response.data && e.response.data.error) {
          dispatch({type: types.SUBMIT_FAILURE, errors: e.response.data.error.data.issues});
        } else {
          throw e;
        }
      }
    };
  },

};
