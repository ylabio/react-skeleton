import {memo} from 'react';
import useI18n from "@src/services/i18n/use-i18n";
import useInit from '@src/services/use-init';
import {useParams} from 'react-router-dom';
import useServices from '@src/services/use-services';
import Head from "@src/ui/navigation/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import ArticleList from '@src/features/catalog/components/article-list';
import CategoryTree from '@src/features/catalog/components/category-tree';

function CatalogPage() {
  const {locale, t} = useI18n();
  const {categoryId} = useParams<{ categoryId: string }>();
  const services = useServices();

  useInit(async () => {
    // Инициализация параметров для начально выборки по ним
    await services.store.modules.articles.initParams({filter: {category: categoryId}});
  }, [categoryId, locale], {ssr: 'articles.init'});

  useInit(async () => {
    await services.store.modules.categories.load({fields: '*', limit: 1000});
  }, [locale], {ssr: 'categories.load'});

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <h2>{t('catalog.title')}</h2>
      <CategoryTree/>
      <hr/>
      <ArticleList/>
    </PageLayout>
  );
}

export default memo(CatalogPage);
