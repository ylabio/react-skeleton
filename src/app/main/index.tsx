import React, {memo} from 'react';
import PageLayout from "@src/ui/layout/page-layout";
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/main-menu";
import LocaleSelect from "@src/features/i18n/containers/locale-select";

function Main() {

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <h2>Главная страница</h2>
      <p>
        Каркас приложения на React & Vite с рендером на сервере (SSR) или клиенте (SPA).
        Открытая структура кода для свободного изменения с примерами типовых функций - авторизации,
        модальными окнами, интернационализации, интеграции апи, навигации, фильтрации и др.
      </p>
      {/*<ul>*/}
      {/*  <li>/app</li>*/}
      {/*  <li>/features</li>*/}
      {/*  <li>/services</li>*/}
      {/*  <li>/ui - библиотека глупых компонент для разметки интерфейса. Часто дополняется сторонними библиотеками - Material Design, And Design или другими</li>*/}
      {/*  <li>/utils</li>*/}
      {/*</ul>*/}
    </PageLayout>
  );
}

export default memo(Main);
