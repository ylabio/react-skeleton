import React from 'react';
import ArticleList from '@src/features/catalog/containers/article-list';
import useInit from '@src/utils/hooks/use-init';
import { useParams } from 'react-router-dom';
import useServices from '@src/utils/hooks/use-services';

function Catalog() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const services = useServices();

  useInit(
    () => {
      // Инициализация параметров для начально выборки по ним
      services.store.actions.articles.initParams({ filter: { category: categoryId } });
      services.store.actions.articles.findMany({});
    },
    [categoryId],
  );

  // useInit(
  //   async () => {
  //     await services.store.actions.categories.load({ fields: '*', limit: 1000 });
  //   },
  //   [],
  //   { ssr: 'categories.load' },
  // );

  return (
    <>
        <h1>Каталог</h1>
        <hr />
        <ArticleList />
    </>
  );
}

export default React.memo(Catalog);
