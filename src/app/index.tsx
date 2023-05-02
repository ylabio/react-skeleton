import React, { Fragment, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import Loading from '@src/app/loading';
import Catalog from '@src/app/catalog';
import Main from '@src/app/main';

// Динамический импорт. При сборке деление на чанки
// const Main = loadable(() => import('@src/app/main'), { fallback: <Loading /> });
// const Catalog = loadable(() => import('@src/app/catalog'), { fallback: <Loading /> });

function App() {
  return (
    <Fragment>
      <Helmet>
        <title>Example</title>
      </Helmet>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:categoryId" element={<Catalog />} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default React.memo(App);
