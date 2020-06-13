import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import LayoutPage from '@components/layouts/layout-page';
import HeaderContainer from '@containers/header-container';
import LayoutContent from '@components/layouts/layout-content';

function Private(props) {
  let { path } = props.match;
  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Page 1</h1>
        <p>Внутренняя страница для авторизованных</p>
        <p>
          <Link to="/private">Дашборд</Link>
        </p>
        <p>
          <Link to="/private/sub">Sub</Link>
        </p>
        <Switch>
          <Route path={`${path}/sub`} component={() => <h1>Sub</h1>} />
        </Switch>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Private);
