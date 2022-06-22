import React from 'react';
import LayoutContent from '@src/components/layouts/layout-content';
import HeaderContainer from '@src/containers/header-container';
import LayoutPage from '@src/components/layouts/layout-page';

interface Props {}

function About(props: Props) {
  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>О проекте</h1>
        <p>Скелет приложения на React с примерами компонент и навигацией</p>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(About);
