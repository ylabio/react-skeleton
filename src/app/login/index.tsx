import React, {Fragment, useCallback} from 'react';
import FormLogin from '@src/components/forms/form-login';
import useSelector from '@src/services/store/use-selector';
import useServices from '@src/services/use-services';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/i18n/containers/locale-select";

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
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
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
