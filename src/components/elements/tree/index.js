import React from "react";

const Tree = React.memo((props) => {
  if (props.items && props.items.length) {
    return (
      <ul className={"Tree"}>
        {props.items.map(item => (
          <li key={item._id} className={"Tree__item"}>
            <span>{props.renderItem ? props.renderItem(item) : item?.title}</span>
            <Tree {...props} items={item?.children}/>
          </li>
        ))}
      </ul>
    )
  }
  return null;
});

export default Tree;
