import React, {useEffect, useMemo, useRef} from 'react';
import Core from "./core";
import './style.css';

function Draw() {

  const dom = useRef<HTMLDivElement>(null);
  const core = useMemo(() => new Core(), []);

  useEffect(() => {
    if (dom.current) core.mount(dom.current);
    return () => core.unmount();
  }, []);

  return (
    <div className="Draw" ref={dom}/>
  );
}

export default React.memo(Draw);
