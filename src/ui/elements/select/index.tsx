import React, {memo} from "react";
import './style.less';

interface Props<Value extends string | number> {
  options: {
    value: Value,
    title: string,
  }[],
  value: Value,
  onChange?: (value: Value) => void
}

function Select<Value extends string | number>(props: Props<Value>) {

  const onSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
    if (props.onChange) props.onChange(e.target.value as Value);
  };

  return (
    <select className="Select" value={props.value} onChange={onSelect}>
      {props.options.map(item => (
        <option key={item.value} value={item.value}>{item.title}</option>
      ))}
    </select>
  );
}

export default memo(Select);
