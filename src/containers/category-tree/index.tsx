import React from 'react';
import { Link } from 'react-router-dom';
import Tree from '@src/components/elements/tree';
import useSelector from '@src/utils/hooks/use-selector';
import useServices from '@src/utils/hooks/use-services';

interface Props {}

function CategoryTree(props: Props) {
  const select = useSelector((state: any) => ({
    //items: state.categories.items,
    roots: state.categories.roots,
    wait: state.categories.wait,
  }));

  const services = useServices();

  if (services.env.IS_NODE) {
    return <div>Здесь будет меню!!!</div>;
  }

  if (select.wait) {
    return <div>{select.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <Tree
        items={select.roots}
        renderItem={item => <Link to={`/catalog/${item._id}`}>{item.title}</Link>}
      />
    );
  }
}

export default React.memo(CategoryTree);
