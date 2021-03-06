import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import articles from '@src/store/articles/actions';
import categories from '@src/store/categories/actions';
import LayoutContent from '@src/components/layouts/layout-content';
import HeaderContainer from '@src/containers/header-container';
import LayoutPage from '@src/components/layouts/layout-page';
import ArticleList from '@src/containers/article-list';
import CategoryTree from '@src/containers/category-tree';
import useInit from '@src/utils/hooks/use-init';

function Catalog(props) {
  const categoryId = props.match.params.categoryId;

  useInit(async () => {
    await articles.init({ categoryId });
  }, [categoryId]);

  useInit(async () => {
    await categories.load({ fields: '*', limit: 1000 });
  });

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
