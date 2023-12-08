import replacestream from 'replacestream';

type TPipe = <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable;

/**
 * Трансформация потока - вставка мета-тегов перед закрытием </head>
 * @param pipe
 * @param ssr
 * @return {*}
 */
export default function streamHtmlReplace(pipe: TPipe, ssr: ServerSideRenderInjections): any {
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
    replacestream(/<title[^>]*>([^<]*)<\/title>/ui, (match, value) => {
      const newValue = ssr.title ? ssr.title(value) : value;
      if (newValue.startsWith('<title')) {
        return newValue;
      } else {
        return `<title>${newValue}</title>`;
      }
    }, {limit: 1})
  ).pipe(
    replacestream('</head>', (ssr.head ? ssr.head() : '') + '</head>', {limit: 1})
  ).pipe(
    replacestream('</body>', (ssr.body ? ssr.body() : '') + '</body>', {limit: 1})
  );
}
