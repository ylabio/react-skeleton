import replacestream from 'replacestream';
import {HelmetServerState} from "react-helmet-async";

type TPipe = <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable;

/**
 * Трансформация потока - вставка мета-тегов перед закрытием </head>
 * @param pipe
 * @param helmet
 * @return {*}
 */
export default function streamHelmet(pipe: TPipe, helmet: HelmetServerState) {
  return pipe(
    replacestream(/<html[^>]*>/ui, `<html ${helmet.htmlAttributes.toString()}>`, {limit: 1})
  ).pipe(
    replacestream(/<title>[^<]*<\/title>/ui, helmet.title.toString(), {limit: 1})
  ).pipe(
    replacestream('</head>',
      helmet.meta.toString() +
      helmet.link.toString() +
      helmet.script.toString() +
      helmet.noscript.toString() +
      helmet.style.toString() +
      '</head>'
      , {limit: 1})
  ).pipe(
    replacestream(/<body[^>]*>/ui, `<body ${helmet.bodyAttributes.toString()}>`, {limit: 1})
  );
}
