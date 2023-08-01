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
    // await services.store.modules.categories.load({fields: '*', limit: 1000});
    await services.store.modules.categories.load({fields: '*', limit: 1000});
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
      <CategoryTree/>
      <hr/>
      <ArticleList/>
    </PageLayout>
  );
}

export default memo(CatalogPage);
