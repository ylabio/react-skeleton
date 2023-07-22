import {memo} from 'react';
import {Link} from 'react-router-dom';
import PageLayout from "@src/ui/layout/page-layout";
import Head from "@src/ui/navigation/head";
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
