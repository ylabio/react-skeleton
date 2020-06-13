import React from 'react';
import LayoutContent from '@components/layouts/layout-content';
import LayoutPage from '@components/layouts/layout-page';

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
