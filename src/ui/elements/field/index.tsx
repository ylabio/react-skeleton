import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.less';

interface Props {
  label?:React.ReactNode,
  error?: React.ReactNode,
  children?: React.ReactNode,
}

function Field(props: Props) {
  const cn = bem('Field');
  return (
    <div className={cn()}>
      <label className={cn('label')}>{props.label}</label>
      <div className={cn('input')}>
        {props.children}
      </div>
      <div className={cn('error')}>
        {props.error}
      </div>
    </div>
  );
}

export default memo(Field);
