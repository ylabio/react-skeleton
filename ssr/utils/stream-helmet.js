import streamReplace from "stream-replace";

/**
 * Трансформация потока - вставка мета-тегов перед закрытием </head>
 * @param pipe
 * @param helmet
 * @return {*}
 */
export default function streamHelmet(pipe, helmet) {
  return pipe(
    streamReplace(/<html[^>]*>/ui, `<html ${helmet.htmlAttributes.toString()}>`)
  ).pipe(
    streamReplace(/<title>[^<]*<\/title>/ui, helmet.title.toString())
  ).pipe(
    streamReplace('</head>',
      helmet.meta.toString() +
      helmet.link.toString() +
      helmet.script.toString() +
      helmet.noscript.toString() +
      helmet.style.toString() +
      '</head>'
    )
  ).pipe(
    streamReplace(/<body[^>]*>/ui, `<body ${helmet.bodyAttributes.toString()}>`)
  );
}
