import React, {useCallback, useRef} from 'react';
import './style.less';

function Canvas(props, ref) {
  return <div className="Canvas" ref={ref}></div>;
}

export default React.memo(React.forwardRef(Canvas));
