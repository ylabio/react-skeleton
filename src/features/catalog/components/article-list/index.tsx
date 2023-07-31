import {memo} from 'react';
import useStoreState from "@src/services/store/use-store-state";

function ArticleList() {

  const articles = useStoreState('articles');

  if (articles.wait || !articles.items) {
    return <div>{articles.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <ul>
        {articles.items.map((item: any) => (
          <li key={item._id}>
            {item.title} | {item.madeIn.title} | {item.category.title} | {item.price} руб
          </li>
        ))}
      </ul>
    );
  }
}

export default memo(ArticleList);
