import React, { Fragment, useCallback } from 'react';
import LayoutPage from '@src/components/layouts/layout-page';
import HeaderContainer from '@src/containers/header-container';
import LayoutContent from '@src/components/layouts/layout-content';
import FormLogin from '@src/components/forms/form-login';
import useSelector from '@src/utils/hooks/use-selector';
import useServices from '@src/utils/hooks/use-services';

function Login() {
  const select: any = useSelector((state: any) => ({
    formLogin: state.formLogin,
  }));

  const services = useServices();

  const callbacks = {
    onChangeForm: useCallback(async (data: any) => {
      await services.store.formLogin.change(data);
    }, []),
    onSubmitForm: useCallback(async (data: any) => {
      await services.store.formLogin.submit(data);
      // @todo перейти на страницу, с которой был редирект или по умочланию в приватный раздел
      services.navigation.goPrivate();
    }, []),
  };

  return (
    <LayoutPage header={<HeaderContainer />}>
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
}

export default React.memo(Login);
