import {memo} from 'react';
import { Link } from 'react-router-dom';
import Tree from '@src/ui/elements/tree';
import useStoreState from "@src/services/store/use-store-state";
import useSelector from "@src/services/store/use-selector";

function CategoryTree() {

  // const select = useSelector(state => ({
  //   items: state.categories.items,
  //   roots: state.categories.roots,
  //   wait: state.categories.wait,
  // }));

  const categories = useStoreState('categories');

  if (categories.wait) {
    return <div>{categories.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <Tree
        items={categories.roots}
        renderItem={item => <Link to={`/catalog/${item._id}`}>{item.title}</Link>}
      />
    );
  }
}

export default memo(CategoryTree);
