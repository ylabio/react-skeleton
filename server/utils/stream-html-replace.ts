import replacestream from 'replacestream';

type TPipe = <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable;

/**
 * Трансформация потока - вставка мета-тегов перед закрытием </head>
 * @param pipe
 * @param ssr
 * @return {*}
 */
export default function streamHtmlReplace(pipe: TPipe, ssr: ServerSideRenderInjections) {
  return pipe(
    replacestream(/<html([^>]*)>/ui, ((match, attr) => {
      const newAttr = ssr.htmlAttr ? ssr.htmlAttr(attr) : attr;
      return newAttr ? `<html ${newAttr}>` : `<html>`;
    }), {limit: 1})
  ).pipe(
    replacestream(/<body[^>]*>/ui, (match, attr) => {
      const newAttr = ssr.bodyAttr ? ssr.bodyAttr(attr) : attr;
      return newAttr ? `<html ${newAttr}>` : `<html>`;
    }, {limit: 1})
  ).pipe(
    replacestream(/<title>([^<]*)<\/title>/ui, ((match, value) => ssr.titleTag ? ssr.titleTag(value) : match), {limit: 1})
  ).pipe(
    replacestream('</head>', (ssr.insertHead ? ssr.insertHead() : '') + '</head>', {limit: 1})
  ).pipe(
    replacestream('</body>', (ssr.insertBody ? ssr.insertBody() : '') + '</body>', {limit: 1})
  );
}
