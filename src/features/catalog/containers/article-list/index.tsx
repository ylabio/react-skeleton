import {memo, useCallback} from 'react';
import useStoreState from "@src/services/store/use-store-state";
import Pagination from "@src/ui/navigation/pagination";
import useServices from "@src/services/use-services";
import Spinner from "@src/ui/elements/spinner";

function ArticleList() {

  const store = useServices().store;
  const router = useServices().router;
  const articles = useStoreState('articles');

  const callbacks = {
    // Пагинация
    onPaginate: useCallback((page: number) => {
      store.modules.articles.setParams({page});
    }, [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return router.makeHref(store.modules.articles.exportParams({page}));
    }, [])
  };

  return (
    <Spinner active={articles.wait}>
      <ul>
        {articles.data.items.map((item: any) => (
          <li key={item._id}>
            {item.title} | {item.madeIn.title} | {item.category.title} | {item.price} руб
          </li>
        ))}
      </ul>
      <Pagination
        count={articles.data.count} page={articles.params.page} limit={articles.params.limit}
        onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}
      />
    </Spinner>
  );
}

export default memo(ArticleList);
