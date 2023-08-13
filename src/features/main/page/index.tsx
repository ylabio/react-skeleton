import {memo} from 'react';
import PageLayout from "@src/ui/layout/page-layout";
import Head from "@src/ui/layout/head";
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
    </PageLayout>
  );
}

export default memo(Main);
