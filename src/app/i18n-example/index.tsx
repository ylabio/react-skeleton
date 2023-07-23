import React, {useCallback} from 'react';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import useServices from "@src/services/use-services";
import LocaleSelect from "@src/features/i18n/containers/locale-select";

interface IProps {
  close?: () => void;
}

function I18nExamplePage(props: IProps) {
  const i18n = useServices().i18n;

  const callbacks = {

  };

  return (
    <PageLayout>
      <Head title="React Skeleton">
        <LocaleSelect/>
      </Head>
      <MainMenu/>
      <h2>Интернационализация (i18n)</h2>
      <p>

      </p>
    </PageLayout>
  );
}

export default React.memo(I18nExamplePage);
