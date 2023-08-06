import {memo} from "react";
import './style.less';

interface Props {
  active?: boolean,
  children?: React.ReactNode;
}

function Spinner({active = false, children}: Props) {
  if (active) {
    return <div className="Spinner">{children}</div>;
  } else {
    return children;
  }
}

export default memo(Spinner);
