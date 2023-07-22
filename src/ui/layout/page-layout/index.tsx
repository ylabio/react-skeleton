import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.less';

interface Props {
  children?: React.ReactNode;
  head?: React.ReactNode;
  footer?: React.ReactNode;
}

function PageLayout({head, footer, children}: Props) {

  const cn = bem('PageLayout');

  return (
    <div className={cn()}>
      <div className={cn('wrap')}>
        <div className={cn('head')}>
          {head}
        </div>
        <div className={cn('center')}>
          {children}
        </div>
        <div className={cn('footer')}>
          {footer}
        </div>
      </div>
    </div>
  );
}

export default memo(PageLayout);
