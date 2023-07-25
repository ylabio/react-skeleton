import {memo} from 'react';
import useSelector from '@src/services/store/use-selector';

function ArticleList() {

  const select = useSelector(state => ({
    items: state.articles.items,
    wait: state.articles.wait,
  }));

  if (select.wait || !select.items) {
    return <div>{select.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <ul>
        {select.items.map((item: any) => (
          <li key={item._id}>
            {item.title} | {item.madeIn.title} | {item.category.title} | {item.price} руб
          </li>
        ))}
      </ul>
    );
  }
}

export default memo(ArticleList);
