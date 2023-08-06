import {memo, useCallback, useMemo} from "react";
import useServices from "@src/services/use-services.js";
import useStoreState from "@src/services/store/use-store-state.js";
import useI18n from "@src/services/i18n/use-i18n";
import SideLayout from "@src/ui/layout/side-layout";
import Select from "@src/ui/elements/select";
import Input from "@src/ui/elements/input";

function CatalogFilter() {
  const {t} = useI18n();
  const {store} = useServices();
  const {params} = useStoreState('articles');

  const callbacks = {
    // Сортировка
    onSort: useCallback((sort: string) => {
      store.modules.articles.setParams({sort});
    }, [store]),
    // Поиск
    onSearch: useCallback((query: string) => {
      store.modules.articles.setParams({query, page: 1});
    }, [store]),
    // Сброс
    onReset: useCallback(() => store.modules.articles.resetParams({}), [store]),
  };

  const options = {
    sort: useMemo(() => ([
      {value: 'order', title: 'По порядку'},
      {value: 'title.ru', title: 'По именованию'},
      {value: '-price', title: 'Сначала дорогие'},
      {value: 'edition', title: 'Древние'},
    ]), []),
  };

  return (
    <SideLayout padding="medium">
      <Select options={options.sort} value={params.sort} onChange={callbacks.onSort}/>
      <Input name="query" value={params.query} onChange={callbacks.onSearch} placeholder={'Поиск'} delay={1000}/>
      <button onClick={callbacks.onReset}>{t('catalog.filter.reset')}</button>
    </SideLayout>
  );
}

export default memo(CatalogFilter);
