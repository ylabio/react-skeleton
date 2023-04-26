import React, { useMemo } from 'react';
import useSelector from '@src/utils/hooks/use-selector';
import useServices from '@src/utils/hooks/use-services';
import useInit from '@src/utils/hooks/use-init';
import { useParams } from 'react-router';
import useSuspense from '@src/utils/hooks/use-suspense';

function ArticleList() {
  const services = useServices();
  const { categoryId } = useParams<{ categoryId: string }>();

  // useInit(
  //   () => {
  //     services.store.actions.articles.initParams({ filter: { category: categoryId } });
  //   },
  //   [categoryId],
  // );

  const select = useSelector((state) => ({
    items: state.articles.items,
    // wait: state.articles.wait,
  }));

  useSuspense(async () => services.store.actions.articles.initParams({ filter: { category: categoryId } }), `ArticleList${categoryId}`);

  return (
    <ul>
      <li>Test</li>
      {select.items.map((item: any) => (
        <li key={item._id}>
          {item.title} | {item.maidIn.title} | {item.category.title} | {item.price} руб
        </li>
      ))}
    </ul>
  );
}

export default React.memo(ArticleList);
