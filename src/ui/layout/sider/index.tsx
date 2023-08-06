import React, {memo} from "react";
import './style.less';

interface Props {
  children?: React.ReactNode;
}

function Sider({children}: Props){
  return (
    <div className='Sider'>
      {children}
    </div>
  );
}

export default memo(Sider);
