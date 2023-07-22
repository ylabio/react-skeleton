import React from 'react';
import Head from "@src/ui/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/ui/layout/page-layout";

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
