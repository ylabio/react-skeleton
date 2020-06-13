import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import RoutePrivate from '@containers/route-private';
import Modals from '@app/modals';
import Loading from '@app/loading';

// import Main from '@app/main';
// import Login from '@app/login';
// import About from '@app/about';
// import Catalog from '@app/catalog';
// import Private from '@app/private';
// import NotFound from '@app/not-found';

const Main = loadable(() => import('@app/main'), { fallback: <Loading /> });
const Login = loadable(() => import('@app/login'), { fallback: <Loading /> });
const About = loadable(() => import('@app/about'), { fallback: <Loading /> });
const Catalog = loadable(() => import('@app/catalog'), { fallback: <Loading /> });
const Private = loadable(() => import('@app/private'), { fallback: <Loading /> });
const NotFound = loadable(() => import('@app/not-found'), { fallback: <Loading /> });

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
