import parse from "html-dom-parser";
import React, {FunctionComponent, ReactNode} from "react";

export type TAttrMapNames = { [attr: string]: string };
export type TAttributes = { [attr: string]: string | number | boolean | null };
export type TDomItems = ReturnType<typeof parse>

/**
 * Словарь переименования атрибутов
 */
const attrMap: TAttrMapNames = {
  'xml:lang': 'xmlLang',
  'http-equiv': 'httpEquiv',
  'crossorigin': 'crossOrigin',
  'class': 'className'
};

/**
 * переименование атрибутов в формат React JSX
 * @param attr
 * @param names
 */
function attrRenames(attr: TAttributes, names: TAttrMapNames = attrMap) {
  const keys = Object.keys(attr);
  const result: TAttributes = {};
  for (const key of keys) {
    if (key in names) {
      result[names[key]] = attr[key];
    } else {
      result[key] = attr[key];
    }
  }
  return result;
}

/**
 * Конвертирует строковый HTML шаблон в react элемент со вставкой в него компонента React
 * @param Component React компонент (функция)
 * @param template HTML шаблон
 * @param place Идентификатор html тега, внутри которого вставить компонент
 * @param props Свойства компоненту
 */
export default function reactTemplate(Component: FunctionComponent, template: string, place = 'app', props = {}) {
  const domTree = parse(template.trim().replace(/>\s+</ug, '><'));
  const scripts: string[] = [];
  const modules: string[] = [];

  const buildReactElements = (nodes: TDomItems): ReactNode[] => {
    const result = [];
    for (const item of nodes) {
      const children = 'children' in item ? buildReactElements(item.children as TDomItems) : [];
      if (item.type === 'tag') {
        if (item.attribs.id === place) children.push(React.createElement(Component, props));
        result.push(React.createElement(item.name, attrRenames(item.attribs), ...children));
      } else if (item.type === 'text') {
        result.push(item.data);
      } else if (item.type === 'script') {
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
