import React from 'react';
import {Route, Routes, Link} from 'react-router-dom';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/main-menu";
import PageLayout from "@src/ui/layout/page-layout";

function Private() {

  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <MainMenu/>
      <h2>Page 1</h2>
      <p>Внутренняя страница для авторизованных</p>
      <p>
        <Link to="/private">Дашборд</Link>
      </p>
      <p>
        <Link to="/private/sub">Sub</Link>
      </p>
      <hr/>
      <Routes>
        <Route index element={<div>Роут Дашборд</div>}/>
        <Route path="sub" element={<div>Роут Sub</div>}/>
      </Routes>
    </PageLayout>
  );
}

export default React.memo(Private);
