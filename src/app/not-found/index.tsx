import {memo} from "react";
import {Link} from 'react-router-dom';
import Head from "@src/ui/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/ui/layout/page-layout";

function NotFound() {
  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <Navigation/>
      <h2>404</h2>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </PageLayout>
  );
}

export default memo(NotFound);
