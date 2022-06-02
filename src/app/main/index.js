import React, {useCallback, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import LayoutPage from '@src/components/layouts/layout-page';
import HeaderContainer from '@src/containers/header-container';
import LayoutContent from '@src/components/layouts/layout-content';
import Button from '@src/components/elements/button';
import Accordion from '@src/components/elements/accordion';
import useServices from "@src/utils/hooks/use-services";
import Canvas from "@src/components/elements/canvas";

function Main() {

  const services = useServices();

  const ref = useRef();

  const callbacks = {
    showInfo: useCallback(async () => {
      const result = await services.store.modals.open('info', {
        overflowTransparent: false,
        overflowClose: true,
      });
    }, []),
  };

  useEffect(()=>{
    services.draw.mount(ref.current);
    return ()=>{
      services.draw.demount();
    }
  },[])

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
        <Canvas ref={ref}/>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Main);
