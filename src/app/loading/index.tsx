import React from 'react';
import Head from "@src/components/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/layouts/page-layout";

function Loading() {
  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <Navigation/>
      <p>Загрузка...</p>
    </PageLayout>
  );
}

export default React.memo(Loading);
