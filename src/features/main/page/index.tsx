import {memo} from 'react';
import PageLayout from "@src/ui/layout/page-layout";
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import useI18n from "@src/services/i18n/use-i18n";

function Main() {
  const {t} = useI18n();
  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <h2>{t('main.page.title')}</h2>
      <p>{t('main.page.content')}</p>
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
