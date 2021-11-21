import React from 'react';
import services from '@src/services';
import LayoutContent from '@src/components/layouts/layout-content';
import HeaderContainer from '@src/containers/header-container';
import LayoutPage from '@src/components/layouts/layout-page';
import ArticleList from '@src/containers/article-list';
import CategoryTree from '@src/containers/category-tree';
import useInit from '@src/utils/hooks/use-init';
import {useParams} from "react-router-dom";

function Catalog(props) {

  const {categoryId} = useParams();

  useInit(async () => {
    // Динамическое созадние endpoint к апи
    services.api.createEndpoint({name: 'super', proto: 'crud', url: '/api/v1/articles'});
    // Динамическое создание состояния для товаров
    services.store.createState({name: 'super', proto: 'articles', apiEndpoint: 'super'});
  }, []);

  useInit(async () => {
    // Инициализация параметров для начально выборки по ним
    await services.store.get('super').initParams({filter: {category: categoryId }});
    //await services.store.articles.initParams({filter: {category: categoryId }});
  }, [categoryId], { ssr: 'articles.init' });

  useInit( async () => {
    await services.store.categories.load({ fields: '*', limit: 1000 });
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
