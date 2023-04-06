import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import Loading from '@src/app/loading';

// Динамический импорт. При сборке деление на чанки
const Main = loadable(() => import('@src/app/main'), { fallback: <Loading /> });


function App() {
  return (
    <Fragment>
      <Helmet>
        <title>Example</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Fragment>
  );
}

export default React.memo(App);
