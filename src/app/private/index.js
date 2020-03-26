import React, {Fragment, useEffect, useLayoutEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {Helmet} from "react-helmet";
import LayoutPage from "@components/layouts/layout-page";
import HeaderContainer from "@containers/header-container";
import LayoutContent from "@components/layouts/layout-content";

const Private = React.memo((props) => {

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Page 1</h1>
        <p>Внутренняя страница для авторизованных</p>
      </LayoutContent>
    </LayoutPage>
  );
});

export default Private;
