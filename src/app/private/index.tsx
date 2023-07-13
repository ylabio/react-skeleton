import React from 'react';
import {Route, Routes, Link} from 'react-router-dom';
import Head from "@src/components/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/layouts/page-layout";

function Private() {

  return (
    <PageLayout>
      <Head title="React Skeleton"></Head>
      <Navigation/>
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
