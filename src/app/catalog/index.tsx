import React from 'react';
import LayoutContent from '@src/components/layouts/layout-content';
import HeaderContainer from '@src/containers/header-container';
import LayoutPage from '@src/components/layouts/layout-page';
import ArticleList from '@src/containers/article-list';
import CategoryTree from '@src/containers/category-tree';
import useInit from '@src/utils/hooks/use-init';
import { useParams } from 'react-router-dom';
import useServices from '@src/utils/hooks/use-services';

function Catalog() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const services = useServices();

  useInit(
    async () => {
      // Инициализация параметров для начально выборки по ним
      await services.store.articles.initParams({ filter: { category: categoryId } });
    },
    [categoryId],
    { ssr: 'articles.init' },
  );

  useInit(
    async () => {
      await services.store.categories.load({ fields: '*', limit: 1000 });
    },
    [],
    { ssr: 'categories.load' },
  );

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Каталог</h1>
        <CategoryTree />
        <hr />
        <ArticleList />
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Catalog);
