import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Private from '@app/private';
import Login from '@app/login';
import Main from '@app/main';
import NotFound from '@app/not-found';
import About from '@app/about';
import Modals from '@app/modals';
import Catalog from '@app/catalog';
import RoutePrivate from '@containers/route-private';

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
