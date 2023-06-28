import React from "react";
import {renderToPipeableStream} from "react-dom/server";
import loadTemplate from "../../utils/load-template.js";
import loadRoot from "../../utils/load-root.js";
import initVite from "../../utils/init-vite.js";
import reactTemplate from "../../utils/react-template.js";
import streamHelmet from "../../utils/stream-helmet.js";
// Fix for render;
React.useLayoutEffect = React.useEffect;

export default async ({app, initialStore, config}) => {
  const vite = await initVite(app, config.PROD);
  const root = await loadRoot(vite, config.PROD);
  let template = await loadTemplate(config.PROD);

  // Запрос на файл, которого нет (чтобы не ренлерить приложение из-за этого)
  // Если файл есть, то он бы отправился обработчиком статический файлов
  app.get('/*', async (req, res, next) => {
    if (req.originalUrl.match(/\.[a-z0-9]+$/u)) {
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end('Not Found');
    } else {
      next();
    }
  });

  // Рендер
  app.get('/*', async (req, res) => {
    // Секрет для идентификации стейта
    const secret = initialStore.makeSecretKey();

    const {Root, servicesManager, head} = await root({
      navigation: {
        // Точка входа для навигации (какую страницу рендерить)
        initialEntries: [req.originalUrl],
      },
    });

    // Apply Vite HTML transforms. This injects the Vite HMR client
    if (config.DEV) {
      template = await vite.transformIndexHtml(req.originalUrl, template);
    }

    let didError = false;
    let isCrawler = true;

    const sendHeaders = (res) => {
      res.cookie('stateSecret', secret.secret, {httpOnly: true/*, maxAge: 100/*, secure: true*/});
      res.writeHead(didError ? 500 : 200, {'Content-Type': 'text/html; charset=utf-8'});
    };

    const {jsx, scrips, modules} = reactTemplate(Root, template);

    const {pipe, abort} = renderToPipeableStream(jsx, {
      bootstrapScriptContent: `window.initialKey="${secret.key}"`,
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
          streamHelmet(pipe, head.helmet).pipe(res);
        } else {
          //res.end('<h1>Something</h1>');
        }
        // Дамп состояния всех сервисов запоминается в initialStore
        initialStore.remember(secret, servicesManager.collectDump());
      },
      onError(error) {
        didError = true;
        if (config.DEV) {
          vite.ssrFixStacktrace(error);
        }
        console.error(error);
      }
    });
    // Timeout
    setTimeout(() => abort(), 10000);
  });
};
