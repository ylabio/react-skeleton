import React from 'react';
import useSelectorMap from '@utils/hooks/use-selector-map';
import { Link } from 'react-router-dom';
import Tree from '@components/elements/tree';
import ssrPlaceholder from '@utils/ssr-placeholder';
// import { DatePicker } from 'antd';

const CategoryTree = ssrPlaceholder(
  // WEB
  props => {
    const select = useSelectorMap(state => ({
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
  },
  // SSR
  props => {
    return <div>Здесь будет меню!!!</div>;
  },
);

export default React.memo(CategoryTree);
