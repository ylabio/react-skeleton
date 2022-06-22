import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import LayoutContent from '@src/components/layouts/layout-content';
import { Helmet } from 'react-helmet';

function NotFound() {
  return (
    <Fragment>
      <Helmet>
        <title>404</title>
        <meta name="status" content="404" />
      </Helmet>
      <LayoutContent>
        <h1>404</h1>
        <p>Страница не найдена</p>
        <Link to="/">На главную</Link>
      </LayoutContent>
    </Fragment>
  );
}

export default React.memo(NotFound);
