import React, {Fragment, useCallback} from 'react';
import LayoutPage from "@components/layouts/layout-page";
import HeaderContainer from "@containers/header-container";
import LayoutContent from "@components/layouts/layout-content";
import FormLogin from "@components/forms/form-login";
import useSelectorMap from "@utils/use-selector-map";
import useCallbackMap from "@utils/use-callback-map";
import * as actions from "@store/actions";
import history from '@app/history';
import {useDispatch} from "react-redux";

const Login = React.memo((props) => {

  const select = useSelectorMap(state => ({
    formLogin: state.formLogin
  }));

  const callbacks = useCallbackMap({
    onChangeForm: async data => {
      await actions.formLogin.change(data);
    },
    onSubmitForm: data => {
      const login = async (data) => {
        await actions.formLogin.submit(data);
        history.goPrivate();
      };
      login(data);
        // @todo перейти на страницу, с которой был редирект или по умочланию в приватный раздел
    },
  });

  return (
    <LayoutPage header={<HeaderContainer/>}>
      <LayoutContent>
        <Fragment>
          <h1>Login page</h1>
          <FormLogin
            data={select.formLogin.data}
            errors={select.formLogin.errors}
            wait={select.formLogin.wait}
            onChange={callbacks.onChangeForm}
            onSubmit={callbacks.onSubmitForm}
          />
        </Fragment>
      </LayoutContent>
    </LayoutPage>
  );
});

export default Login;
