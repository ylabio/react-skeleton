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
import {renderToPipeableStream} from "react-dom/server";
import React from "react";
import StateCache from "./state-cache.js";
import proxyConfig from '../proxy.js';
import {
  initProxy,
  initVite,
  initApp,
  initTemplate,
  loadRoot,
  wrapTemplate, insertHelmet
} from "./utils.js";

// Fix for render;
React.useLayoutEffect = React.useEffect;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = await initApp(isProduction);
await initProxy(app, proxyConfig);
const vite = await initVite(app, isProduction);
const root = await loadRoot(vite, isProduction);
const stateCache = new StateCache();
let template = await initTemplate(isProduction);

// Выборка состояния с которым выполнялся рендер
// Выборка доступна один раз
app.get('/ssr/state/:key', async (req, res) => {
  const key = req.params.key;
  const secret = req.cookies.stateSecret;
  res.json(stateCache.get({key, secret}));
});

// Asset файлы
app.get('/*', async (req, res, next) => {
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
    next();
  }
});

// Рендер
app.get('/*', async (req, res, next) => {
  console.time('render');

  // Секрет для идентификации стейта
  const secret = stateCache.makeSecretKey();

  const {Root, services, head} = await root({
    navigation: {
      // Точка входа для навигации (какую страницу рендерить)
      initialEntries: [req.originalUrl],
    },
    ssr: {
      stateKey: secret.key
    },
  });

  // Apply Vite HTML transforms. This injects the Vite HMR client
  if (isDevelopment) {
    template = await vite.transformIndexHtml(req.originalUrl, template);
  }

  let didError = false;
  let isCrawler = false;

  const sendHeaders = (res) => {
    res.cookie('stateSecret', secret.secret, {httpOnly: true/*, maxAge: 100/*, secure: true*/});
    res.writeHead(didError ? 500 : 200, {'Content-Type': 'text/html; charset=utf-8'});
  };

  const {html, scrips, modules} = wrapTemplate(Root, template);

  const {pipe, abort} = renderToPipeableStream(html, {
    bootstrapScriptContent: `window.stateKey="${secret.key}"`,
    bootstrapModules: modules,
    bootstrapScripts: scrips,
    onShellReady() {
      if (!isCrawler) {
        sendHeaders(res);
        pipe(res);
      }
    },
    onShellError(error) {
      res.setHeader(500, {'Content-Type': 'text/html; charset=utf-8'});
      res.send('<h1>Something went wrong</h1>');
    },
    onAllReady() {
      if (isCrawler) {
        sendHeaders(res);
        insertHelmet(pipe, head.helmet).pipe(res);
      }
      // Запоминаем состояние на несколько секунд
      stateCache.remember(secret, {
        // Состояние, с которым выполнен рендер
        state: services.store.getState(),
        // Ключи исполненных ожиданий (чтобы клиент знал, какие действия были выполнены на сервере)
        keys: services.ssr.getPrepareKeys()
      });
      console.timeEnd('render');
    },
    onError(error) {
      didError = true;
      if (!isProduction) {
        vite.ssrFixStacktrace(error);
      }
      console.error(error);
    }
  });
  // Timeout
  setTimeout(() => abort(), 10000);
});

app.listen(5173);

process.on('unhandledRejection', function (reason /*, p*/) {
  console.error('unh', reason);
  process.exit(1);
});

console.log(`Server run on http://localhost:5173`);
// console.log(`Server run on http://${config.renderServer.host}:${config.renderServer.port}`);
