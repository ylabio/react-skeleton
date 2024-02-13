/**
 * Шаблонизатор
 * @param template
 * @param render
 * @param secretKey
 * @param injections
 * @return string
 */
export default function renderReplace(template: string, render: string, secretKey: string, injections: ServerSideRenderInjections = {}): any {
  return template
    .replace(/<html([^>]*)>/ui, (match, attr) => {
      const newAttr = injections.htmlAttr ? injections.htmlAttr(attr) : attr;
      return newAttr ? `<html ${newAttr}>` : `<html>`;
    })
    .replace(/<body[^>]*>/ui, (match, attr) => {
      const newAttr = injections.bodyAttr ? injections.bodyAttr(attr) : attr;
      return newAttr ? `<body ${newAttr}>` : `<body>`;
    })
    .replace(/<title[^>]*>([^<]*)<\/title>/ui, (match, value) => {
      const newValue = injections.title ? injections.title(value) : value;
      if (newValue.startsWith('<title')) {
        return newValue;
      } else {
        return `<title>${newValue}</title>`;
      }
    })
    .replace('</head>', (injections.head ? injections.head() : '') + '</head>')
    .replace('</body>', (injections.body ? injections.body() : '') + '</body>')
    .replace('<div id="app">', (match) => {
      return match + render;
    })
    .replace('<head>', (match) => {
      return match + `<script type="module">window.initialKey="${secretKey}"</script>`;
    });
}
