import React, {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import {Props} from "./types";
import './style.less';

function Menu(props: Props) {
  const {
    items = [],
    onNavigate = (item) => {}
  } = props;

  const cn = bem('Menu');
  return (
    <ul className={cn()}>
      {items.map(item => (
        <li key={item.key} className={cn('item')}>
          <Link to={item.link} onClick={() => onNavigate(item)}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default memo(Menu);
