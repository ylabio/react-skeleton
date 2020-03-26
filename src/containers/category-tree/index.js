import React from 'react';
import useSelectorMap from "@utils/use-selector-map";
import {Link} from 'react-router-dom';
import Tree from '@components/elements/tree';
// import { DatePicker } from 'antd';

const CategoryTree = React.memo((props) => {

  const select = useSelectorMap(state => ({
    //items: state.categories.items,
    roots: state.categories.roots,
    wait: state.categories.wait
  }));

  if (select.wait) {
    return <div>{select.wait && (<i>Загрузка...</i>)}</div>
  } else {
    return (
      <Tree items={select.roots}
            renderItem={item => (
              <Link to={`/catalog/${item._id}`}>{item.title}</Link>
            )}/>
    );
  }
});

export default CategoryTree;
