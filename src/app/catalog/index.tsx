import React, { Suspense } from 'react';
import useServices from '@src/utils/hooks/use-services';
import Loading from '../loading';
import Button from '@src/components/elements/button';

const ArticleList = React.lazy(() => import('@src/features/catalog/containers/article-list'));

function Catalog() {
  const services = useServices();

  return (
    <>
        <Button onClick={() => {services.navigation.push('/')}}>Главная</Button>
        <h1>Каталог</h1>
        <hr />
        <Suspense fallback={<Loading />}>
          <ArticleList />
          <ArticleList />
          <ArticleList />
        </Suspense>
    </>
  );
}

export default React.memo(Catalog);
