import React, {memo} from "react";
import {cn as bem} from "@bem-react/classname";
import {Props} from "./types";
import './style.less';

function Menu(props: Props) {
  const {
    items = [],
  } = props;

  const cn = bem('Menu');
  return (
    <ul className={cn()}>
      {items.map((item, index) => (
        <li key={item.key} className={cn('item')}>
          {props.linkRender(item, index)}
        </li>
      ))}
    </ul>
  );
}

export default memo(Menu);
