import {memo} from 'react';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import useI18n from "@src/services/i18n/use-i18n";

interface Props {
  close?: () => void;
}

function I18nExamplePage(props: Props) {
  const {t} = useI18n();

  return (
    <PageLayout>
      <Head title="React Skeleton">
        <LocaleSelect/>
      </Head>
      <MainMenu/>
      <h2>{t('example-i18n.title')}</h2>
      <p>
      </p>
    </PageLayout>
  );
}

export default memo(I18nExamplePage);
