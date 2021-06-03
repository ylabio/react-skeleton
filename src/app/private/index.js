import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import LayoutPage from '@src/components/layouts/layout-page';
import HeaderContainer from '@src/containers/header-container';
import LayoutContent from '@src/components/layouts/layout-content';
import Universal from '@src/containers/universal';

function Private(props) {
  let { path } = props.match;

  // @todo Инициализировать api по аннотациям
  // @todo Инициализировать редьюсеры и экшены по аннотациям.
  // @todo Взять аннотацию разделов админки и на каждый раздел отрендерить Route
  // @todo Обращение

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
          <Route path={`${path}/sub`} component={() => <Universal name="users" />} />
        </Switch>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Private);
