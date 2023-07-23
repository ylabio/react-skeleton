import {memo} from 'react';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import LoginForm from "@src/features/auth/components/login-form";

function LoginPage() {

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <LoginForm/>
    </PageLayout>
  );
}

export default memo(LoginPage);
