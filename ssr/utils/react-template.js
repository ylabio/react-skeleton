import parse from "html-dom-parser";
import React from "react";

const attrMap = {
  'xml:lang': 'xmlLang',
  'http-equiv': 'httpEquiv',
  'crossorigin': 'crossOrigin',
  'class': 'className'
};

function attrRenames(attr, names = attrMap){
  const keys = Object.keys(attr);
  let result = {};
  for (const key of keys) {
    if (names[key]) {
      result[names[key]] = attr[key];
    } else {
      result[key] = attr[key];
    }
  }
  return result;
}

export default function reactTemplate(Component, template, place = 'app') {
  const domTree = parse(template.trim().replace(/>\s+</ug,'><'));

  let scripts = [];
  let modules = [];

  const buildReactElements = (nodes) => {
    let result = [];
    for (const item of nodes) {
      let children = item.children ? buildReactElements(item.children) : [];
      if (item.type === 'tag') {
        if (item.attribs.id === place) children.push(React.createElement(Component));
        result.push(React.createElement(item.name, attrRenames(item.attribs), ...children));
      } else
      if (item.type === 'text') {
        result.push(item.data);
      } else
      if (item.type === 'script') {
        if (children.length) {
          result.push(React.createElement(item.name, {
            ...attrRenames(item.attribs),
            dangerouslySetInnerHTML: {__html: children.join('')}
          }));
        } else {
          if (item.attribs.type === 'module') {
            modules.push(item.attribs.src);
          } else {
            scripts.push(item.attribs.src);
          }
        }
      }
    }
    return result;
  };

  const result = buildReactElements(domTree);

  return {jsx: result.at(0), scripts, modules};
}
