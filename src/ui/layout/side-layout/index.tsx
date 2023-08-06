import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.less';

interface Props {
  children?: React.ReactNode;
  side?: 'start' | 'end' | 'between';
  align?: 'top' | 'middle' | 'baseline' | 'bottom';
  padding?: 'small' | 'medium' | 'none';
  wrap?: boolean
}

function SideLayout({children, side = 'start', padding = 'none', align = 'middle', wrap=true}: Props) {
  const cn = bem('SideLayout');
  if (wrap) {
    return (
      <div className={cn({side, padding, align})}>
        {React.Children.map(children, (child, index) => {
          const key = isChildWithKey(child) ? child.key : index;
          return <div key={key} className={cn('item')}>{child}</div>;
        })}
      </div>
    );
  } else {
    return (
      <div className={cn({side, padding, align})}>
        {children}
      </div>
    );
  }
}

interface ChildWithKey {
  key: unknown;
}

function isChildWithKey(node: ChildWithKey | unknown): node is ChildWithKey {
  return !!(node && 'key' in (node as ChildWithKey));
}

export default memo(SideLayout);
