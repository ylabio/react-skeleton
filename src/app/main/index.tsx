import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import LayoutPage from '@src/components/layouts/layout-page';
import HeaderContainer from '@src/containers/header-container';
import LayoutContent from '@src/components/layouts/layout-content';
import Button from '@src/components/elements/button';
import Accordion from '@src/components/elements/accordion';
import useServices from '@src/utils/hooks/use-services';

function Main() {
  const services = useServices();

  const callbacks = {
    showInfo: useCallback(async () => {
      const result = await services.store.modals.open('info', {
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
