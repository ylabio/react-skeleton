import React from 'react';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from "@containers/header-container";
import LayoutPage from "@components/layouts/layout-page";

const NotFound = React.memo((props) => {

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>О проекте</h1>
        <p>Скелет приложения на React с примерами компонент и навигацией</p>
      </LayoutContent>
    </LayoutPage>
  );
});

export default NotFound;
