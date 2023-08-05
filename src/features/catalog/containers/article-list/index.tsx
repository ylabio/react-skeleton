import {memo, useCallback} from 'react';
import useStoreState from "@src/services/store/use-store-state";
import Pagination from "@src/ui/navigation/pagination";
import useServices from "@src/services/use-services";

function ArticleList() {

  const store = useServices().store;
  const articles = useStoreState('articles');

  const callbacks = {
    // Пагинация
    onPaginate: useCallback((page: number) => store.modules.articles.setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({
        page: page.toString(),
        limit: articles.params.limit.toString(),
        sort: articles.params.sort,
      })}`;
    }, [articles.params])
  };

  if (articles.wait || !articles.data.items) {
    return <div>{articles.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <>
        <ul>
          {articles.data.items.map((item: any) => (
            <li key={item._id}>
              {item.title} | {item.madeIn.title} | {item.category.title} | {item.price} руб
            </li>
          ))}
        </ul>
        <Pagination
          count={articles.data.count} page={articles.params.page} limit={articles.params.limit}
          onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
      </>
    );
  }
}

export default memo(ArticleList);
