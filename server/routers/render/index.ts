import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import RenderQueue from './queue';
import render, { type RenderParams } from './render';
import {
  getHeadersValues,
  parseAcceptEncoding,
  parseControls,
} from '../../utils/parse-head';
import { URLPattern } from 'urlpattern-polyfill';
import uniqid from 'uniqid';
import gzip from 'node-gzip';
import type { Request, Response } from 'express';
import type {
  IRouteContext,
  TCache,
  TSSRResponse,
  TRenderRule,
} from '../../types';

/**
 * SSR - рендер React приложения в HTML
 * @param app Express приложение
 * @param cacheStore Хранилище для запоминания рендера
 * @param config Настройки сервера
 * @param env Переменные окружения
 */
export default async ({ app, cacheStore, config, env }: IRouteContext) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const rules: TRenderRule[] = config.render.rules.map((rule) => ({
    patterns: (Array.isArray(rule.url) ? rule.url : [rule.url]).map(
      (url) => new URLPattern(url, 'http://test'),
    ),
    ssr: Boolean(config.render.enabled && rule.ssr),
    cacheAge: 'cacheAge' in rule ? Number(rule.cacheAge) : 60,
    control: rule.control ? parseControls(rule.control) : new Map(),
    controlSrc: rule.control || '',
    vary: rule.vary || [],
    spaHttpStatus: rule.spaHttpStatus || 200,
    ssrWait: Boolean(rule.ssrWait),
    ssrSendAged: Boolean(rule.ssrSendAged),
  }));

  function getRuleByUrl (
    url: string,
    headers: Record<string, string | undefined | string[]>,
  ): TRenderRule {
    const result: TRenderRule = (() => {
      for (const rule of rules) {
        for (const pattern of rule.patterns) {
          if (pattern.test(url, 'http://test')) {
            console.log('- render rule:', pattern.pathname);
            return { ...rule };
          }
        }
      }
      console.log('- render rule: default');
      return {
        patterns: [new URLPattern('/*', 'http://test')],
        ssr: config.render.enabled,
        cacheAge: 60,
        control: new Map(),
        controlSrc: '',
        vary: [] as string[],
        spaHttpStatus: 200,
        ssrWait: false,
        ssrSendAged: false,
      };
    })();

    // Требуется ожидание рендера вне зависимости от правила ренлера
    if (headers['x-ssr-wait'] === 'true') result.ssrWait = true;
    // Если ожидание рендера, то нельзя отправлять старый рендер
    if (result.ssrWait) result.ssrSendAged = false;

    return result;
  }

  // Сборщик Vite для рендера в режиме разработки (vite компилирует исходники и поставляет свои скрипты)
  const vite = env.DEV
    ? await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    : undefined;

  if (vite) app.use(vite.middlewares);

  // React приложение для ренедра. В режиме разработки компилируется исходники через Vite
  const clientApp = vite
    ? (await vite.ssrLoadModule('../src/root.tsx')).default
    : undefined;

  // HTML шаблон, куда вставим рендер
  const template = fs.readFileSync(
    path.resolve(
      __dirname,
      env.DEV ? '../../../src/index.html' : '../../../dist/client/index.html',
    ),
    'utf-8',
  );

  const renderQueue = env.PROD
    ? new RenderQueue(cacheStore, config.render.workers)
    : undefined;
  const ETagSPA = uniqid();

  const sendCache = async (
    req: Request,
    res: Response,
    cache: TCache,
    rule: TRenderRule,
    params: RenderParams,
  ) => {
    const response: TSSRResponse = {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: undefined,
    };
    response.headers['Cache-Control'] = rule.controlSrc;
    response.headers['Vary'] = rule.vary.join(', ');
    response.headers['Age'] = Math.floor((Date.now() - cache.time) / 1000);
    response.headers['ETag'] = cache.etag;
    //response.headers['Last-Modified'] = new Date(cache.time).toUTCString();

    // Если кэш есть у клиента
    if (
      await cacheStore.isValid(params.key, {
        'if-none-match': req.headers['if-none-match'],
        'if-modified-since': req.headers['if-modified-since'],
      })
    ) {
      // SSR 304 (у браузера есть валидный кэш)
      console.log('- send 304 SSR Cache');
      response.status = 304;
    } else {
      // SSR Cache (отдаём рендер из кэша)
      console.log(`- send ${cache.status} SSR Cache`);
      response.status = cache.status;
      // Если редирект, то тело не отправляем
      if (cache.location) {
        response.headers['location'] = cache.location;
      }
      // Если 404, то отправляем SPA так как тело рендера не кэшировалось
      else if (cache.status === 404) {
        response.body = params.template;
      }
      // Отправляем рендер
      else {
        const acceptEncoding = parseAcceptEncoding(
          req.headers['accept-encoding'] as string,
        );
        if (acceptEncoding.includes('gzip') && cache.compressed) {
          response.headers['Content-Encoding'] = 'gzip';
          response.body = cache.html;
        } else {
          // Клиент не поддерживает сжатие.
          response.body = cache.compressed
            ? await gzip.ungzip(cache.html)
            : cache.html;
        }
      }
    }
    res.writeHead(response.status, response.headers);
    res.end(response.body);
  };

  const sendSPA = async (
    req: Request,
    res: Response,
    rule: TRenderRule,
    params: RenderParams,
  ) => {
    const response: TSSRResponse = {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public,max-age=0,must-revalidate',
        ETag: ETagSPA,
      },
      body: undefined,
    };
    if (req.headers['if-none-match'] === ETagSPA) {
      // 304 SPA (у браузера есть кэша SPA страницы)
      console.log('- send 304 SPA');
      response.status = 304;
    } else {
      // 200 SPA (клиент ещё не получал SPA или SPA "новый")
      console.log(`- send ${rule.spaHttpStatus} SPA`);
      response.status = rule.spaHttpStatus;
      response.body = params.template;
    }
    res.writeHead(response.status, response.headers);
    res.end(response.body);
  };

  // Если url на файл, то отдаём 404, чтобы не рендерить приложение из-за него
  // Если файл есть, то запрос обработался бы через express.static или в nginx
  app.get(/\.[a-z0-9]+$/u, (req: Request, res: Response) => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('Not Found');
  });

  // Запросы на рендер страницы
  app.get('/*', async (req: Request, res: Response) => {
    const rule = getRuleByUrl(req.originalUrl, req.headers);

    // Все параметры для рендера
    const params: RenderParams = {
      env,
      // Ключ кэширования страницы
      key: cacheStore.generateKey([
        req.url,
        req.cookies['locale'] || req.headers['accept-language'],
        ...getHeadersValues(req.headers, rule.vary),
      ]),
      url: req.originalUrl,
      headers: req.headers,
      cookies: req.cookies,
      template: vite
        ? await vite.transformIndexHtml(req.originalUrl, template)
        : template,
      maxAge: rule.cacheAge,
    };

    const cache = await cacheStore.get(params.key);
    // Уже в очереди на рендер, но не завис там
    const isWaiting = await cacheStore.isWaiting(params.key, 900);
    // Кэш принадлежит текущей версии приложения
    const isValidSignature = await cacheStore.isValidSignature(params.key);
    // Кэш не старый
    const isValidAge = await cacheStore.isValid(params.key, {
      date: new Date(),
    });
    // Кэш не старый или можно слать старый?
    const canSendCache = isValidAge || rule.ssrSendAged;

    // SSR - Если рендер уже выполнен или можно слать старый
    if (rule.ssr && cache && isValidSignature && canSendCache) {
      await sendCache(req, res, cache, rule, params);
    }
    // SSR - Требуется ожидание рендера (включен, но кэша ещё нет)
    else if (rule.ssr && rule.ssrWait) {
      console.log('- waiting render');
      cacheStore.onReady(params.key, async (cache) => {
        await sendCache(req, res, cache, rule, params);
      });
    } else {
      // SPA
      await sendSPA(req, res, rule, params);
    }

    // Обновление кэша если его нет или невалидный, но он ещё не в процессе обновления
    if (rule.ssr && !isValidAge && !isWaiting) {
      // В dev режиме рендер в основном потоке, чтобы проще отлаживать
      // В prod режиме добавляем рендер в очередь
      if (env.DEV) {
        try {
          await cacheStore.waiting(params.key);
          const { html, status, location } = await render(clientApp, params);
          await cacheStore.update(
            params.key,
            html,
            status,
            params.maxAge,
            location,
          );
        } catch (e) {
          await cacheStore.remove(params.key);
        }
      } else {
        await cacheStore.waiting(params.key);
        renderQueue?.push(params);
      }
    }
  });
};
