import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import Loading from '@src/app/loading';

// Динамический импорт. При сборке деление на чанки
const Main = loadable(() => import('@src/app/main'), { fallback: <Loading /> });
const Catalog = loadable(() => import('@src/app/catalog'), { fallback: <Loading /> });

function App() {
  return (
    <Fragment>
      <Helmet>
        <title>Example</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </Fragment>
  );
}

export default React.memo(App);
