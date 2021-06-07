import React from 'react';
import services from '@src/services';
//import articles from '@src/store/articles/actions';
//import categories from '@src/store/categories/actions';
import LayoutContent from '@src/components/layouts/layout-content';
import HeaderContainer from '@src/containers/header-container';
import LayoutPage from '@src/components/layouts/layout-page';
import ArticleList from '@src/containers/article-list';
import CategoryTree from '@src/containers/category-tree';
import useInit from '@src/utils/hooks/use-init';

function Catalog(props) {
  const categoryId = props.match.params.categoryId;

  useInit(async () => {
    await services.actions.articles.init({ categoryId });
  }, [categoryId], { ssr: 'articles.init' });

  useInit( async () => {
    await services.actions.categories.load({ fields: '*', limit: 1000 });
    //await categories.load({ fields: '*', limit: 1000 });
  }, [], { ssr: 'categories.load' } );

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
