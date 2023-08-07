import {memo} from 'react';
import {useParams} from 'react-router-dom';
import useI18n from "@src/services/i18n/use-i18n";
import useInit from '@src/services/use-init';
import useServices from '@src/services/use-services';
import useRefreshKey from "@src/services/router/use-refresh-key";
import Head from "@src/ui/layout/head";
import MainMenu from "@src/features/navigation/components/main-menu";
import PageLayout from "@src/ui/layout/page-layout";
import LocaleSelect from "@src/features/example-i18n/components/locale-select";
import ArticleList from '@src/features/catalog/containers/article-list';
import CategoryTree from '@src/features/catalog/containers/category-tree';
import SideLayout from "@src/ui/layout/side-layout";
import Sider from "@src/ui/layout/sider";
import Content from "@src/ui/layout/content";
import CatalogFilter from "@src/features/catalog/containers/catalog-filter";

function CatalogPage() {
  const {store} = useServices();
  const {locale, t} = useI18n();
  const {categoryId} = useParams<{ categoryId: string }>();

  // Если при навигации через location.state передан признак refreshArticles=true,
  // то получим новый ключ и сможем перезагрузить список
  const refreshKey = useRefreshKey('refreshArticles');

  useInit(async () => {
    // Инициализация параметров каталога
    await store.modules.articles.initParams({category: categoryId, page: 1});
  }, [categoryId, locale, refreshKey], {ssr: 'articles.init'});

  useInit(async () => {
    // Загрузка списка категорий
    await store.modules.categories.load({fields: '*', limit: 1000});
  }, [locale], {ssr: 'categories.load'});

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect/></Head>
      <MainMenu/>
      <h2>{t('catalog.title')}</h2>
      <p>
        Отображение отфильтрованного списка загруженного из АПИ.
        Параметры списка: сортировка, пагинация, поиск - являются параметрами списка.
        Параметры могут сохранятся в адресе страницы и восстанавливаться из адреса при открытии
        страницы по прямой ссылке.
        Все действия происходят над параметрами списка (фильтра) - их установка, сброс,
        восстановление.
        Список элементов подгружается из АПИ с учётом установленных (текущих) параметров.
        Варианты значений для некоторых элементов фильтра загружаются отдельно.
        Для них отдельное внешнее состояние.
      </p>
      <SideLayout side="between" align="top" wrap={false}>
        <Sider>
          <CategoryTree/>
        </Sider>
        <Content>
          <CatalogFilter/>
          <ArticleList/>
        </Content>
      </SideLayout>
    </PageLayout>
  );
}

export default memo(CatalogPage);
