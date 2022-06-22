import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import LayoutPage from '@src/components/layouts/layout-page';
import HeaderContainer from '@src/containers/header-container';
import LayoutContent from '@src/components/layouts/layout-content';

function Private() {

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Page 1</h1>
        <p>Внутренняя страница для авторизованных</p>
        <p>
          <Link to="/private">Дашборд</Link>
        </p>
        <p>
          <Link to="/private/sub">Sub</Link>
        </p>
        <hr/>
        <Routes>
          <Route index element={<div>Роут Дашборд</div>} />
          <Route path="sub" element={<div>Роут Sub</div>} />
        </Routes>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Private);
