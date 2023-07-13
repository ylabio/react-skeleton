import {memo} from 'react';
import {Link} from 'react-router-dom';
import PageLayout from "@src/components/layouts/page-layout";
import Head from "@src/components/navigation/head";
import Navigation from "@src/containers/navigation";

function Main() {

  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <Navigation/>
      <h2>Главная страница</h2>
      <p>
        <Link to="/private">Раздел для авторизованных</Link>
      </p>
    </PageLayout>
  );
}

export default memo(Main);
