import Button from '@src/components/elements/button';
import useServices from '@src/utils/hooks/use-services';
import React from 'react';

function Main() {
  const services = useServices()

  return (
    <>
      <h1>Главная страница</h1>
      <Button onClick={() => {services.navigation.push('catalog')}}>Каталог</Button>
    </>
  );
}

export default React.memo(Main);
