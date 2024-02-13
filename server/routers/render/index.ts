import fs from "fs";
import path from "path";
import React from "react";
import {Request, Response} from "express";
import {renderToPipeableStream} from "react-dom/server";
import {createServer as createViteServer} from "vite";
import {fileURLToPath} from "url";
import {IRouteContext} from "../../types";
import renderReplace from "../../utils/render-replace";
import RenderStream from "../../utils/render-stream";
import CacheStore from "../../utils/cache-store";

/**
 * SSR - рендер React приложения в HTML
 * @param app Express приложение
 * @param cacheStore Хранилище для запоминания рендера
 * @param config Настройки сервера
 * @param env Переменные окружения
 */
export default async ({app, cacheStore, config, env}: IRouteContext) => {
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

  // HTML шаблон, куда вставим рендер
  const rootTemplate = fs.readFileSync(
    path.resolve(__dirname, env.DEV
      ? '../../../src/index.html'
      : '../../../dist/client/index.html'),
    'utf-8',
  );

  // Рендер на все запросы
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

    // Корневой React компонент, сервис менеджер приложения и контекст с мета-данными html
    // Для react приложения передаются параметры запросы, чтобы рендерилась соответсвующая страница
    const {Root, injections} = await root({
      ...env,
      req: {
        url: req.originalUrl,
        headers: req.headers,
        cookies: req.cookies
      }
    }) as RootFabricResult;

    // Ключ кэширования страницы
    const cacheKey = CacheStore.generateKey([
      req.url,
      req.cookies['locale'] || req.headers['accept-language'],
    ]);

    // Признак, отправлен ли ответ клиенту
    let isSend = false;

    // Отправка ответа клиенту.
    // Если есть кэш, то отправляется кэш
    // Если кэш н готов, то отправляется SPA
    const send = () => {
      if (!isSend) {
        isSend = true;
        const html = cacheStore.getHtml(cacheKey);
        if (html) {
          // Отдача кэша (или рендера, если успеет выполниться)
          res.cookie('stateSecret', cacheStore.getSecret(cacheKey), {httpOnly: true/*, maxAge: 100/*, secure: true*/});
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public,max-age=300,s-maxage=900'
          });
          res.end(html);
        } else {
          // Отдача SPA если долго ждали рендер
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          res.end(template);
        }
      }
    };

    // Если есть кэш, то отдаём его
    if (cacheStore.isExists(cacheKey)) {
      send();
    }

    // Обновление кэша если он старый, но ещё не в процессе обновления
    if (cacheStore.isOld(cacheKey) && !cacheStore.isWaiting(cacheKey)) {
      // Кэширование также используется, чтобы избежать параллельных рендеров одних и тех же страниц.
      cacheStore.waiting(cacheKey);

      // Рендер
      const renderStream = new RenderStream();
      const {pipe} = renderToPipeableStream(React.createElement(Root), {
        onAllReady() {
          pipe(renderStream);
        },
        onError(error) {
          if (vite) vite.ssrFixStacktrace(error as Error);
          console.error(error);
        },
      });

      renderStream.on('finish', () => {
        const render = renderStream.getRender();
        // Состояние сервисов, с которым выполнился рендер
        const dump = injections && injections.dump ? injections.dump() : {};
        // Итоговый рендер HTML со всеми инъекциями в шаблон
        const html = renderReplace(template, render, cacheKey, injections);
        cacheStore.update(cacheKey, html, dump);
        // Пробуем отправить кэш (возможно уже отправлен)
        send();
      });
    }

    // Таймаут на случай ожидания рендера (если кэш не будет подготовлен или будут ошибки, то отправится SPA)
    setTimeout(send, config.render.timeout);
  });
};
