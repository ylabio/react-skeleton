import React from 'react';
import {Link} from "react-router-dom";
import * as actions from "@store/actions";
import LayoutPage from "@components/layouts/layout-page";
import HeaderContainer from "@containers/header-container";
import LayoutContent from "@components/layouts/layout-content";
import Button from "@components/elements/button";
import Accordion from "@components/elements/accordion";
import useCallbackMap from "@utils/use-callback-map";

const Main = React.memo((props) => {

  const callbacks = useCallbackMap({
    showInfo: async () => {
      const result = await actions.modal.open('info', {
        overflowTransparent: false,
        overflowClose: true
      });
      console.log(result);
    }
  });

  return (
    <LayoutPage header={<HeaderContainer/>}>
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
});

export default Main;
