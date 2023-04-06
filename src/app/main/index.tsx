import Button from '@src/components/elements/button';
import React from 'react';

function Main() {
  return (
    <>
      <h1>Главная страница</h1>
      <Button onClick={() => {}}>Test</Button>
    </>
  );
}

export default React.memo(Main);
