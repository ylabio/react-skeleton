import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import Modals from '@src/app/modals';
import Loading from '@src/app/loading';
import RequireAuth from '@src/containers/require-auth';
import HeaderContainer from '@src/containers/header-container';

// import Main from '@src/app/main';
// import Login from '@src/app/login';
// import About from '@src/app/about';
// import Catalog from '@src/app/catalog';
// import Private from '@src/app/private';
// import NotFound from '@src/app/not-found';

// Динамический импорт. При сборке деление на чанки
const Main = loadable(() => import('@src/app/main'), { fallback: <Loading /> });
const Login = loadable(() => import('@src/app/login'), { fallback: <Loading /> });
const About = loadable(() => import('@src/app/about'), { fallback: <Loading /> });
const Catalog = loadable(() => import('@src/app/catalog'), { fallback: <Loading /> });
const Private = loadable(() => import('@src/app/private'), { fallback: <Loading /> });
const NotFound = loadable(() => import('@src/app/not-found'), { fallback: <Loading /> });

function App() {
  return (
    <Fragment>
      <Helmet>
        <title>Example</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:categoryId" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/private/*"
          element={
            <RequireAuth redirect="/login">
              <Private />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Modals />
    </Fragment>
  );
}

export default React.memo(App);
