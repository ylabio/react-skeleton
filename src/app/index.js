import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import RoutePrivate from '@src/containers/route-private';
import Modals from '@src/app/modals';
import Loading from '@src/app/loading';

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
      <Switch>
        <Route path="/" exact={true} component={Main} />
        <Route path="/catalog/:categoryId?" component={Catalog} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <RoutePrivate path="/private" failpath="/login" component={Private} />
        <Route component={NotFound} />
      </Switch>
      <Modals />
    </Fragment>
  );
}

export default React.memo(App);
