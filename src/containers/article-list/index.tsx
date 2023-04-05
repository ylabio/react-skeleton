import React from 'react';
// import { DatePicker } from 'antd';

interface Props {
  items: {
    _id: number;
    title: string;
    price: number;
    maidIn: {
      title: string;
    };
    category: {
      title: string;
    };
  }[],
  wait: boolean,
}

function ArticleList(props: Props) {
  if (props.wait || !props.items) {
    return <div>{props.wait && <i>Загрузка...</i>}</div>;
  } else {
    return (
      <ul>
        {props.items.map((item: any) => (
          <li key={item._id}>
            {item.title} | {item.maidIn.title} | {item.category.title} | {item.price} руб
          </li>
        ))}
      </ul>
    );
  }
}

export default React.memo(ArticleList);
