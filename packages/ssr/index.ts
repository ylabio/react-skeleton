import type { Request, Response } from 'express';
import fs from 'fs';
import mc from 'merge-change';
import gzip from 'node-gzip';
import path from 'node:path';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { URLPattern } from 'urlpattern-polyfill';
import { getHeadersValues, parseAcceptEncoding, parseControls } from './parse-head.ts';
import RenderQueue from './queue.ts';
import render, { type RenderParams } from './render.ts';
import type { ICacheStore, TCache } from '../cache-store/types.ts';
import type { ViteDev } from '../vite-dev';
import type { SsrOptions, TRenderRule, TSSRResponse } from './types.ts';

export class Ssr {
  protected data: Record<string, any> = {};
  protected rules: TRenderRule[];
  protected ETagSPA: string;
  protected renderQueue: RenderQueue | undefined;
  protected config: SsrOptions;
  private clientApp: any;
  private template: string;

  constructor(protected depends: {
    cacheStore: ICacheStore,
    env: ImportMetaEnv,
    vite: ViteDev,
    configs: Patch<SsrOptions>
  }) {
    this.config = mc.merge(this.defaultConfig(this.depends.env), this.depends.configs);

    this.renderQueue = this.depends.env.PROD
      ? new RenderQueue(
        this.depends.cacheStore,
        this.relativeFilePath(this.config.clientAppFile.prod),
        this.config.workers
      )
      : undefined;

    this.ETagSPA = uniqid();

    this.rules = this.config.rules.map((rule) => ({
      patterns: (Array.isArray(rule.url) ? rule.url : [rule.url]).map(
        (url) => new URLPattern(url, 'http://test'),
      ),
      ssr: Boolean(this.config.enabled && rule.ssr),
      cacheAge: 'cacheAge' in rule ? Number(rule.cacheAge) : 60,
      control: rule.control ? parseControls(rule.control) : new Map(),
      controlSrc: rule.control || '',
      vary: rule.vary || [],
      spaHttpStatus: rule.spaHttpStatus || 200,
      ssrWait: Boolean(rule.ssrWait),
      ssrSendAged: Boolean(rule.ssrSendAged),
    }));

    // HTML шаблон, куда вставим рендер
    this.template = fs.readFileSync(
      this.depends.env.DEV
        ? path.resolve(process.cwd(), this.config.template.dev)
        : path.resolve(process.cwd(), this.config.template.prod),
      'utf-8',
    );
  }

  async init() {
    // React приложение для ренедра в режиме разработки (компилируется исходники через Vite)
    // В прод режиме приложение будет загружено из воркера
    this.clientApp = this.depends.vite.isEnabled()
      ? await this.depends.vite.ssrLoadModule(this.config.clientAppFile.dev)
      : undefined;
  }

  private relativeFilePath(rootFilePath: string): string {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const fileName = path.resolve(process.cwd(), rootFilePath);
    return './' + path.relative(__dirname, fileName);
  }

  async sendSPA(
    req: Request,
    res: Response,
    rule: TRenderRule,
    params: RenderParams,
  ) {
    const response: TSSRResponse = {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public,max-age=0,must-revalidate',
        ETag: this.ETagSPA,
      },
      body: undefined,
    };
    if (req.headers['if-none-match'] === this.ETagSPA) {
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
  }

  // Запросы на рендер страницы
  public requestHandler = async (req: Request, res: Response) => {
    const rule = this.getRuleByUrl(req.originalUrl, req.headers);

    // Все параметры для рендера
    const params: RenderParams = {
      env: this.depends.env,
      // Ключ кэширования страницы
      key: this.depends.cacheStore.generateKey([
        req.url,
        req.cookies['locale'] || req.headers['accept-language'],
        ...getHeadersValues(req.headers, rule.vary),
      ]),
      url: req.originalUrl,
      headers: req.headers,
      cookies: req.cookies,
      template: this.depends.vite.isEnabled()
        ? (await this.depends.vite.transformIndexHtml(req.originalUrl, this.template))!
        : this.template,
      maxAge: rule.cacheAge,
    };

    const cache = await this.depends.cacheStore.get(params.key);
    // Уже в очереди на рендер, но не завис там
    const isWaiting = await this.depends.cacheStore.isWaiting(params.key, 900);
    // Кэш принадлежит текущей версии приложения
    const isValidSignature = await this.depends.cacheStore.isValidSignature(params.key);
    // Кэш не старый
    const isValidAge = await this.depends.cacheStore.isValid(params.key, {
      date: new Date(),
    });
    // Кэш не старый или можно слать старый?
    const canSendCache = isValidAge || rule.ssrSendAged;

    // SSR - Если рендер уже выполнен или можно слать старый
    if (rule.ssr && cache && isValidSignature && canSendCache) {
      await this.sendCache(req, res, cache, rule, params);
    }
    // SSR - Требуется ожидание рендера (включен, но кэша ещё нет)
    else if (rule.ssr && rule.ssrWait) {
      console.log('- waiting render');
      this.depends.cacheStore.onReady(params.key, async (cache) => {
        await this.sendCache(req, res, cache, rule, params);
      });
    } else {
      // SPA
      await this.sendSPA(req, res, rule, params);
    }

    // Обновление кэша если его нет или невалидный, но он ещё не в процессе обновления
    if (rule.ssr && !isValidAge && !isWaiting) {
      // В dev режиме рендер в основном потоке, чтобы проще отлаживать
      // В prod режиме добавляем рендер в очередь
      if (this.depends.env.DEV) {
        try {
          await this.depends.cacheStore.waiting(params.key);
          const { html, status, location } = await render(this.clientApp, params);
          await this.depends.cacheStore.update(
            params.key,
            html,
            status,
            params.maxAge,
            location,
          );
        } catch (e) {
          await this.depends.cacheStore.remove(params.key);
        }
      } else {
        await this.depends.cacheStore.waiting(params.key);
        this.renderQueue?.push(params);
      }
    }
  };

  protected defaultConfig(env: ImportMetaEnv): SsrOptions {
    return {
      // Если отключить, то будет всегда отдаваться SPA
      enabled: true,
      workers: 1,
      template: {
        dev: '../../src/index.html',
        prod: '../../dist/client/index.html'
      },
      clientAppFile: {
        dev: '../src/root.tsx',
        prod: '../../dist/server/root.js'
      },
      // Правила рендера и кэширования страниц.
      // Используется первое правило, удовлетворяющие шаблону url
      rules: [
        {
          // Все адреса
          url: '/*',
          ssr: true,
          // Ждём рендер в DEV режиме
          ssrWait: false,
          // Отправлять старый кэш вместо spa (если нет ssrWait)
          ssrSendAged: true,
          // Срок кэша на сервере в секундах. По истечении выполняется перерендер.
          cacheAge: 60 * 15, // 15 минут.
          // Из-за локали в куках используем max-age=0, чтобы браузер всегда узнавал у сервера валидность кэша.
          // Иначе при смене языка и переходе по ссылкам сайта браузер может отобразить свой кэш на старом языке.
          control: `public, max-age=${0}, s-maxage=${0}`,
        },
      ],
    };
  }

  protected getRuleByUrl(
    url: string,
    headers: Record<string, string | undefined | string[]>,
  ): TRenderRule {
    const result: TRenderRule = (() => {
      for (const rule of this.rules) {
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
        ssr: this.config.enabled,
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

  protected async sendCache(
    req: Request,
    res: Response,
    cache: TCache,
    rule: TRenderRule,
    params: RenderParams,
  ) {
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
      await this.depends.cacheStore.isValid(params.key, {
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
  }
}
