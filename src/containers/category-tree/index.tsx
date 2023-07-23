import React from 'react';
import { Link } from 'react-router-dom';
import Tree from '@src/components/elements/tree';
import useSelector from '@src/services/store/use-selector';

function CategoryTree() {
  const select = useSelector((state: any) => ({
    //items: state.categories.items,
    roots: state.categories.roots,
    wait: state.categories.wait,
  }));

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
