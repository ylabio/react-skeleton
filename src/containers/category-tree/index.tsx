import React from 'react';
import { Link } from 'react-router-dom';
import Tree from '@src/components/elements/tree';
import useServices from '@src/utils/hooks/use-services';

interface Props {
  roots: any[];
  wait: boolean;
}

function CategoryTree(props: Props) {
  const services = useServices();

  if (services.env.IS_NODE) {
    return <div>Здесь будет меню!!!</div>;
  }

  if (props.wait) {
    return <div>{props.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <Tree
        items={props.roots}
        renderItem={item => <Link to={`/catalog/${item._id}`}>{item.title}</Link>}
      />
    );
  }
}

export default React.memo(CategoryTree);
