// import {memo, useCallback, useMemo} from "react";
// import useTranslate from "@src/hooks/use-translate";
// import useStore from "@src/hooks/use-store";
// import useSelector from "@src/hooks/use-selector";
// import treeToList from "@src/utils/tree-to-list";
// import listToTree from "@src/utils/list-to-tree";
// import useServices from "@src/services/use-services.js";
// import useStoreState from "@src/services/store/use-store-state.js";
//
// function CatalogFilter({name}) {
//
//   const store = useServices().store;
//
//   const select = useSelector(state => ({
//     sort: state[name].params.sort,
//     query: state.catalog.params.query,
//     category: state.catalog.params.category,
//     categories: state.categories.list,
//   }));
//
//   const articles = useStoreState('articles');
//   const categories = useStoreState('categories');
//
//   const callbacks = {
//     // Сортировка
//     onSort: useCallback(sort => store.actions.catalog.setParams({sort}), [store]),
//     // Поиск
//     onSearch: useCallback(query => store.actions.catalog.setParams({query, page: 1}), [store]),
//     // Сброс
//     onReset: useCallback(() => store.actions.catalog.resetParams(), [store]),
//     // Фильтр по категории
//     onCategory: useCallback(category => store.actions.catalog.setParams({category, page: 1}), [store]),
//   };
//
//   const options = {
//     sort: useMemo(() => ([
//       {value: 'order', title: 'По порядку'},
//       {value: 'title.ru', title: 'По именованию'},
//       {value: '-price', title: 'Сначала дорогие'},
//       {value: 'edition', title: 'Древние'},
//     ]), []),
//     categories: useMemo(() => ([
//       {value: '', title: 'Все'},
//       ...treeToList(listToTree(categories.items), (item, level) => (
//         {value: item._id, title: '- '.repeat(level) + item.title}
//       ))
//     ]), [categories.items]),
//   };
//
//   const {t} = useTranslate();
//
//   return (
//     <SideLayout padding='medium'>
//       <Select options={options.categories} value={select.category} onChange={callbacks.onCategory}/>
//       <Select options={options.sort} value={select.sort} onChange={callbacks.onSort}/>
//       <Input value={select.query} onChange={callbacks.onSearch} placeholder={'Поиск'}
//              delay={1000}/>
//       <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
//     </SideLayout>
//   )
// }
//
// export default memo(CatalogFilter);
