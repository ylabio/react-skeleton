import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './html.less';
import './style.less';

interface Props {
  children?: React.ReactNode;
}

/**
 * Определяет границы страницы, ширину и центрирование по горизонтали.
 * Вложенные элементы выводятся в блочном потоке (сверху вниз).
 * Для создания области шапки и футера используются отдельные компоненты.
 * Для создания боковых областей используются вложенная разметка отдельным компонентом.
 */
function PageLayout({children}: Props) {
  const cn = bem('PageLayout');
  return (
    <div className={cn()}>
      <div className={cn('center')}>
        {children}
      </div>
    </div>
  );
}

export default memo(PageLayout);
