import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as actions from '@store/actions';
import LayoutPage from '@components/layouts/layout-page';
import HeaderContainer from '@containers/header-container';
import LayoutContent from '@components/layouts/layout-content';
import Button from '@components/elements/button';
import Accordion from '@components/elements/accordion';

function Main() {
  const callbacks = {
    showInfo: useCallback(async () => {
      const result = await actions.modal.open('info', {
        overflowTransparent: false,
        overflowClose: true,
      });
    }, []),
  };

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Главная страница</h1>
        <p>
          <Link to="/private">Раздел для авторизованных</Link>
        </p>
        <p>
          <Button onClick={callbacks.showInfo}>Показать модалку</Button>
        </p>
        <Accordion title={'Заголовок'}>
          text for accordion, with other components, ex. <Button>Button</Button>
        </Accordion>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Main);
