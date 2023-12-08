import React from "react";
import {renderToPipeableStream} from "react-dom/server";
import reactTemplate from "../../utils/react-template";
import streamHtmlReplace from "../../utils/stream-html-replace";
import {createServer as createViteServer} from "vite";
import fs from "fs";
import path from "path";
import {IRouteContext} from "../../types";
import {Request, Response} from "express";
import {fileURLToPath} from "url";

/**
 * SSR - рендер React приложения в HTML
 * @param app Express приложение
 * @param initialStore Хранилище для запоминания состояния сервисов
 * @param config Настройки сервера
 * @param env Переменные окружения
 */
export default async ({app, initialStore, config, env}: IRouteContext) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Fix for render;
  React.useLayoutEffect = React.useEffect;

  // Сборщик Vite для рендера в режиме разработки
  const vite = env.DEV ? await createViteServer({
    server: {middlewareMode: true},
    appType: 'custom',
  }) : undefined;
  if (vite) app.use(vite.middlewares);

  // React приложение для ренедра. В режиме разработки импортируются исходники через Vite
  const root = vite
    ? (await vite.ssrLoadModule('../src/root.tsx')).default
    // @ts-ignore
    : (await import('../../../dist/server/root.js')).default;

  // HTML шаблон
  const rootTemplate = fs.readFileSync(
    path.resolve(__dirname, env.DEV
      ? '../../../src/index.html'
      : '../../../dist/client/index.html'),
    'utf-8',
  );

  // Рендер
  app.get('/*', async (req: Request, res: Response) => {
    // Запрос на файл, которого нет (чтобы не рендерить приложение из-за этого)
    // Если файл есть, то он бы отправился обработчиком файлов
    if (req.originalUrl.match(/\.[a-z0-9]+$/u)) {
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end('Not Found');
      return;
    }

    // В режиме разработки в шаблон вставляются скрипты Vite для горячего обновления
    const template = vite
      ? await vite.transformIndexHtml(req.originalUrl, rootTemplate)
      : rootTemplate;

    // Если рендер отключен, то отдаём index.html (шаблон)
    if (!config.render.enabled) {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(template);
      return;
    }

    // Секрет для идентификации дампа от всех сервисов
    const secret = initialStore.makeSecretKey();

    // Корневой React компонент, сервис менеджер приложения и контекст с мета-данными html
    const {Root, ssr} = await root({
      ...env,
      req: {
        url: req.originalUrl,
        headers: req.headers,
        cookies: req.cookies
      }
    }) as RootFabricResult;

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
      onAllReady() {
        sendHeaders(res);
        if (ssr) {
          // Подмешивание разметки в итоговый рендер
          streamHtmlReplace(pipe, ssr).pipe(res);
          // Дамп данных, с которыми выполнен рендер, запоминается в initialStore
          initialStore.remember(secret, ssr.dump);
        } else {
          pipe(res);
        }
      },
      onError(error) {
        didError = true;
        if (vite) vite.ssrFixStacktrace(error as Error);
        console.error(error);
      },
    });
    // Timeout
    setTimeout(() => abort(), 10000);
  });
};
