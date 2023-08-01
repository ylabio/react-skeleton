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
      <p>
        Страница или раздел, требующий авторизацию. При отсутствии авторизованной сессии, выполняется редирект
        к форме авторизации. В шапке сайта выводится информация про сессию - имя авторизованного пользователя
        и копка для выхода (сброса сессии). Токен сессии сохраняется в LocalStorage или куку для
        автоматического восстановления сессии. Проверка и восстановление сессии выполнится при попытки
        перейти в раздел, требующий авторизацию, но бывает и в корне приложения, чтобы показывать
        информацию о сессии в шапке на каждой странице сайте.
      </p>
      <LoginForm/>
    </PageLayout>
  );
}

export default memo(LoginPage);
