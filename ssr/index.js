

process.env.TARGET = process.env.TARGET || 'node';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
/**
 * HTTP server for render
 */
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import StateCache from "./state-cache.js";
import proxyConfig from '../proxy.js';
import insertText from "./insert-text.js";
import {initProxy, initVite, initApp, initRender, initTemplate} from "./utils.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = await initApp(isProduction);
const proxy = await initProxy(app, proxyConfig);
const vite = await initVite(app);
const render = await initRender(vite, isProduction);
const stateCache = new StateCache();
let template = await initTemplate(isProduction);

// Запросы на файлы, которых нет. Отдача 404, чтобы не рендерить страницу
// app.get(/\.ico$/, (req, res) => {
//   res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
//   res.end('404');
// });

// Выборка состояния с которым выполнялся рендер
// Выборка доступна один раз
app.get('/ssr/state/:key', async (req, res) => {
  const key = req.params.key;
  const secret = req.cookies.stateSecret;
  res.json(stateCache.get({key, secret}));
});

// Обработка всех запросов
app.use('*', async (req, res, next) => {
  try {
    if (req.originalUrl.match(/\.[a-z0-9]+$/u)) {
      const file = path.resolve(__dirname, '../dist/client', req.originalUrl.replace(/^[.\/\\]+/, ''));
      fs.access(file, (err) => {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
          res.end('Not Found');
        } else {
          res.sendFile(file);
        }
      });
    } else {
      // Секрет для идентификации стейта
      const secret = stateCache.makeSecretKey();

      const result = await render({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        cookies: req.cookies,
        stateKey: secret.key,
      });

      // Запоминаем состояние на несколько секунд
      stateCache.remember(secret, {state: result.state, keys: result.keys});

      // Apply Vite HTML transforms. This injects the Vite HMR client
      if (isDevelopment) template = await vite.transformIndexHtml(req.originalUrl, template);

      // Inject the app-rendered HTML into the template.
      // @todo В новом react по другому
      let out = template;
      out = insertText.before(out, '<div id="app">', result.html);
      out = out.replace('<title>App</title>', result.head.title);
      out = insertText.before(out, '<head>', result.head.meta);
      out = insertText.after(out, '</head>', result.head.link);
      out = insertText.after(out, '</head>', `<script>window.stateKey="${secret.key}"</script>`);

      // По куке клиент получит своё состояние
      res.cookie('stateSecret', secret.secret, {expires: false, httpOnly: true /*, secure: true*/});
      res.writeHead(result.status, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(out);
    }
  } catch (e) {
    if (!isProduction) vite.ssrFixStacktrace(e);
    // next(e);
    console.error(e);
    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`ERROR ${e.toString()}`);
  }
});

app.listen(5173);

process.on('unhandledRejection', function (reason /*, p*/) {
  console.error(reason);
  process.exit(1);
});

console.log(`Server run on http://localhost:5173`);
// console.log(`Server run on http://${config.renderServer.host}:${config.renderServer.port}`);
