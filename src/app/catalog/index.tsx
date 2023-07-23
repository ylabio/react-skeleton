import React from 'react';
import ArticleList from '@src/containers/article-list';
import CategoryTree from '@src/containers/category-tree';
import useInit from '@src/services/use-init';
import {useParams} from 'react-router-dom';
import useServices from '@src/services/use-services';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/i18n/containers/locale-select";

function Catalog() {
  const {categoryId} = useParams<{ categoryId: string }>();
  const services = useServices();

  useInit(async () => {
    // Инициализация параметров для начально выборки по ним
    await services.store.modules.articles.initParams({filter: {category: categoryId}});
  }, [categoryId], {ssr: 'articles.init'});

  useInit(async () => {
    await services.store.modules.categories.load({fields: '*', limit: 1000});
  }, [], {ssr: 'categories.load'});

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <h2>Каталог</h2>
      <CategoryTree/>
      <hr/>
      <ArticleList/>
    </PageLayout>
  );
}

export default React.memo(Catalog);
