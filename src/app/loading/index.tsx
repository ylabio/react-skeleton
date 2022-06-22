import React from 'react';
import LayoutContent from '@src/components/layouts/layout-content';
import LayoutPage from '@src/components/layouts/layout-page';

function Loading() {
  return (
    <LayoutPage>
      <LayoutContent>
        <p>Загрузка...</p>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Loading);
