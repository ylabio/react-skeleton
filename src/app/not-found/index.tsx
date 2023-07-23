import {memo} from "react";
import {Link} from 'react-router-dom';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/main-menu";
import PageLayout from "@src/ui/layout/page-layout";

function NotFound() {
  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <MainMenu/>
      <h2>404</h2>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </PageLayout>
  );
}

export default memo(NotFound);
