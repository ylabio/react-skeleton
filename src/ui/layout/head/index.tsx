import React, {memo} from "react";
import './style.less';

interface Props {
  children?: React.ReactNode;
  title?: string;
}

function Head({title, children}: Props){
  return (
    <div className='Head'>
      <div className='Head-place'>
        <h1>{title}</h1>
      </div>
      <div className='Head-place'>
        {children}
      </div>
    </div>
  );
}

export default memo(Head);
