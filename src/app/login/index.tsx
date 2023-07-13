import React, {Fragment, useCallback} from 'react';
import FormLogin from '@src/components/forms/form-login';
import useSelector from '@src/utils/hooks/use-selector';
import useServices from '@src/utils/hooks/use-services';
import Head from "@src/components/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/layouts/page-layout";

function Login() {
  const select: any = useSelector((state: any) => ({
    formLogin: state.formLogin,
  }));

  const services = useServices();

  const callbacks = {
    onChangeForm: useCallback(async (data: any) => {
      await services.store.modules.formLogin.change(data);
    }, []),
    onSubmitForm: useCallback(async (data: any) => {
      await services.store.modules.formLogin.submit(data);
      // @todo перейти на страницу, с которой был редирект или по умолчанию в приватный раздел
      services.navigation.goPrivate();
    }, []),
  };

  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <Navigation/>
      <Fragment>
        <h2>Login page</h2>
        <FormLogin
          data={select.formLogin.data}
          errors={select.formLogin.errors}
          wait={select.formLogin.wait}
          onChange={callbacks.onChangeForm}
          onSubmit={callbacks.onSubmitForm}
        />
      </Fragment>
    </PageLayout>
  );
}

export default React.memo(Login);
