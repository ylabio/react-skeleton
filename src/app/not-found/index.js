import React from 'react';
import {Link} from 'react-router-dom';
import LayoutContent from '@components/layouts/layout-content';

const NotFound = React.memo((props) => {

  return (
    <LayoutContent>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </LayoutContent>
  );
});

export default NotFound;
