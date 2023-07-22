import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.less';

interface Props {
  children?: React.ReactNode;
  side?: 'start' | 'end' | 'between';
  padding?: 'small' | 'medium';
}

function SideLayout({children, side, padding}: Props) {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding})}>
      {React.Children.map(children, (child, index) => {
        const key = isChildWithKey(child) ? child.key : index;
        return <div key={key} className={cn('item')}>{child}</div>;
      })}
    </div>
  );
}

interface ChildWithKey {
  key: unknown;
}

function isChildWithKey(node: ChildWithKey | unknown): node is ChildWithKey {
  return !!(node && 'key' in (node as ChildWithKey));
}

export default memo(SideLayout);
