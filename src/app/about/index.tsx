import React from 'react';
import Head from "@src/components/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/layouts/page-layout";

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
