import React, {memo} from "react";
import './style.less';

interface Props {
  children?: React.ReactNode;
}

function Content({children}: Props){
  return (
    <div className='Content'>
      {children}
    </div>
  );
}

export default memo(Content);
