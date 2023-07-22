import React from 'react';
import Head from "@src/ui/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/ui/layout/page-layout";

function About() {
  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <Navigation/>
      <h2>О проекте</h2>
      <p>Скелет приложения на React с примерами компонент и навигацией</p>
    </PageLayout>
  );
}

export default React.memo(About);
