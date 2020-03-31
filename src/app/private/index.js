import React, {Fragment, useEffect, useLayoutEffect} from 'react';
import {Route, Switch, Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import LayoutPage from "@components/layouts/layout-page";
import HeaderContainer from "@containers/header-container";
import LayoutContent from "@components/layouts/layout-content";
import useSelectorMap from "@utils/use-selector-map";
import useActions from "@utils/use-actions";
import * as actions from "@store/actions";
import Main from "@app/main";
import Catalog from "@app/catalog";
import About from "@app/about";
import Login from "@app/login";
import RoutePrivate from "@containers/private-route";
import NotFound from "@app/not-found";

const Private = React.memo((props) => {

  const select = useSelectorMap(state => ({
    session: state.session
  }));

  useActions(async () => {
    // Если нет ожидания сессии и сама сессия отсутсвует, то пробуем восстановить её
    // Иначе её восстановление уже кто-то запустил
    if (!select.session.wait && !select.session.exists)
    await actions.session.remind();
  });

  if (select.session.wait) {
    return <Fragment><span>Загрузка...</span></Fragment>;
  }

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Page 1</h1>
        <p>Внутренняя страница для авторизованных</p>
        <Link to="/private">Дашборд</Link>
        <Link to="/private/sub">Внутренний раздел</Link>

        <Switch>
          <Route path="/private/sub" component={About}/>
        </Switch>

      </LayoutContent>
    </LayoutPage>
  );
});

export default Private;
