import React, { Suspense } from 'react';
import useServices from '@src/utils/hooks/use-services';
import Loading from '../loading';
import Button from '@src/components/elements/button';
import CategoryTree from '@src/features/catalog/containers/category-tree';
import useSuspense from '@src/utils/hooks/use-suspense';

const ArticleList = React.lazy(() => import('@src/features/catalog/containers/article-list'));

function Catalog() {
  const services = useServices();

  useSuspense(
    async () => {
      await services.store.actions.categories.load({ fields: '*', limit: 1000 });
    },
    ['CatalogCategories'],
  );

  return (
    <>
        <Button onClick={() => {services.navigation.push('/')}}>Главная</Button>
        <h1>Каталог</h1>
        <CategoryTree />
        <hr />
        <Suspense fallback={<Loading />}>
          <ArticleList />
        </Suspense>
    </>
  );
}

export default React.memo(Catalog);
