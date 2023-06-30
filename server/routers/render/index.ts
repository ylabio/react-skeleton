import React from "react";
import {renderToPipeableStream} from "react-dom/server";
import reactTemplate from "../../utils/react-template";
import streamHelmet from "../../utils/stream-helmet";
import {createServer as createViteServer} from "vite";
import fs from "fs";
import path from "path";
import {IRouteContext} from "../../types";
import {Request, Response} from "express";
import {fileURLToPath} from "url";

export default async ({app, initialStore, config}: IRouteContext) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Fix for render;
  React.useLayoutEffect = React.useEffect;

  // Сборщик Vite для рендера в режиме разработки
  const vite = config.DEV ? await createViteServer({
    server: {middlewareMode: true},
    appType: 'custom',
  }) : undefined;
  if (vite) app.use(vite.middlewares);

  // React приложение для ренедра. В режиме разработки импортируются исходники через Vite
  const root = vite
    ? (await vite.ssrLoadModule('../src/root.tsx')).default
    : (await import('../../../dist/server/root.js')).default;

  // HTML шаблон
  const rootTemplate = fs.readFileSync(
    path.resolve(__dirname, config.DEV ? '../../../src/index.html' : '../../../dist/client/index.html'),
    'utf-8',
  );

  // Рендер
  app.get('/*', async (req: Request, res: Response) => {
    // Запрос на файл, которого нет (чтобы не рендерить приложение из-за этого)
    // Если файл есть, то он бы отправился обработчиком статический файлов
    if (req.originalUrl.match(/\.[a-z0-9]+$/u)) {
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end('Not Found');
      return;
    }

    // В режиме разработки в шаблон вставляются скрипты Vite для горячего обновления
    const template = vite
      // Apply Vite HTML transforms. This injects the Vite HMR client
      ? await vite.transformIndexHtml(req.originalUrl, rootTemplate)
      : rootTemplate;

    // Вместо рендера отдаём собранный index.html
    if (!config.render.enabled){
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(template);
      return;
    }

    // @todo кэшировать рендер и раздавать его
    // @todo задержки в основном из-за обращения к АПИ (~400ms) чисто рендер (~20ms)
    // @todo применить заголовки HTTP для кэширования в браузере
    // @todo браузер указывает в запросе на страницу no-cache в целях безопасности, т.е. кэширования html не будет выполнять и заставит прокси сервера взять свежие данные

    // Секрет для идентификации дампа от всех сервисов
    const secret = initialStore.makeSecretKey();

    // Корневой React компонент, сервис менеджер приложения и контекст с мета-данными html
    const {Root, servicesManager, head} = await root({
      navigation: {
        // Точка входа для навигации (какую страницу рендерить)
        initialEntries: [req.originalUrl],
      },
    });

    // Режим ожидания всех данных перед отдачей потока
    const isCrawler = true;

    // HTML шаблон конвертирует в ReactNode со вставкой в него компонента приложения.
    // Из шаблона вычленяются скрипты, чтобы отдать их в потоке, но после html разметки.
    const {jsx, scripts, modules} = reactTemplate(Root, template);

    // Признак ошибки
    let didError = false;

    const sendHeaders = (res: Response) => {
      res.cookie('stateSecret', secret.secret, {httpOnly: true/*, maxAge: 100/*, secure: true*/});
      res.writeHead(didError ? 500 : 200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public,max-age=300,s-maxage=900'
      });
    };

    const {pipe, abort} = renderToPipeableStream(jsx, {
      bootstrapScriptContent: `window.initialKey="${secret.key}"`,
      bootstrapModules: modules,
      bootstrapScripts: scripts,
      onShellReady() {
        if (!isCrawler) {
          sendHeaders(res);
          pipe(res);
        }
      },
      onShellError(error) {
        res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
        res.send('<h1>Something went wrong</h1>');
        if (vite) vite.ssrFixStacktrace(error as Error);
        console.error(error);
      },
      onAllReady() {
        if (isCrawler) {
          sendHeaders(res);
          streamHelmet(pipe, head.helmet).pipe(res);
        }
        // Дамп всех сервисов запоминается в initialStore
        initialStore.remember(secret, servicesManager.collectDump());
      },
      onError(error) {
        didError = true;
        if (vite) vite.ssrFixStacktrace(error as Error);
        console.error(error);
      }
    });
    // Timeout
    setTimeout(() => abort(), 10000);
  });
};
