import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as actions from '@store/actions';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';
import LayoutPage from '@components/layouts/layout-page';
import ArticleList from '@containers/article-list';
import CategoryTree from '@containers/category-tree';
import useInit from '@utils/hooks/use-init';

function Catalog(props) {

  const categoryId = props.match.params.categoryId;

  useInit(async () => {
    await actions.articles.init({ categoryId });
  }, [categoryId]);

  useInit(async () => {
    await actions.categories.load({ fields: '*', limit: 1000 });
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
