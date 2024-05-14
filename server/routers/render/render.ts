import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { stringify } from 'zipson';
import BufferedStream from '../../utils/buffered-stream';

export type RenderParams = {
  key: string;
  env: ImportMetaEnv;
  url: string;
  headers: Record<string, string | undefined | string[]>;
  cookies: Record<string, string>;
  template: string;
  maxAge: number;
};

export type RenderResult = {
  html: string;
  // http статус
  status: number;
  // Для редиректа
  location?: string;
  // Параметры рендера
  params: RenderParams;
};

export type RenderError = {
  params: RenderParams;
  error: Error;
};

// Таймаут на случай зацикливания (на крайний случай).
// Должен быть больше чем любые таймауты в приложении, например больше таймаутов на HTTP запросы.
const TIMEOUT_RENDER = 600000;

export default async function render(
  clientApp: RootFabric,
  params: RenderParams,
): Promise<RenderResult> {
  // Fix for react render;
  React.useLayoutEffect = React.useEffect;

  // Получаем React приложение для рендера
  const { Root, injections } = (await clientApp({
    ...params.env,
    req: {
      url: params.url,
      headers: params.headers,
      cookies: params.cookies,
    },
  })) as RootFabricResult;

  const appHtml = await new Promise<string>((resolve, reject) => {
    console.log('- render start', params.url);

    let renderError: Error;
    const stream = new BufferedStream();
    const { pipe, abort } = renderToPipeableStream(React.createElement(Root), {
      onAllReady: () => {
        pipe(stream);
      },
      onError: (error) => {
        renderError = error as Error;
      },
    });

    // Таймаут на случай долгого ожидания рендера
    const renderTimeout: NodeJS.Timeout = setTimeout(() => {
      console.log('- render timeout');
      abort();
    }, TIMEOUT_RENDER);

    stream.on('finish', () => {
      if (renderTimeout) clearTimeout(renderTimeout);
      if (renderError) {
        console.log('- render errors', renderError);
        reject(renderError);
      } else {
        resolve(stream.buffer);
      }
    });
  });

  // Итоговый рендер HTML со всеми инъекциями в шаблон
  const html = params.template
    .replace(/<html([^>]*)>/iu, (match, attr) => {
      const newAttr = injections?.htmlAttr ? injections.htmlAttr(attr) : attr;
      return newAttr ? `<html ${newAttr}>` : `<html>`;
    })
    .replace(/<body[^>]*>/iu, (match, attr) => {
      const newAttr = injections?.bodyAttr ? injections.bodyAttr(attr) : attr;
      return newAttr ? `<body ${newAttr}>` : `<body>`;
    })
    .replace(/<title[^>]*>([^<]*)<\/title>/iu, (match, value) => {
      const newValue = injections?.title ? injections.title(value) : value;
      if (newValue.startsWith('<title')) {
        return newValue;
      } else {
        return `<title>${newValue}</title>`;
      }
    })
    .replace('</head>', (injections?.head ? injections.head() : '') + '</head>')
    .replace('</body>', (injections?.body ? injections.body() : '') + '</body>')
    .replace('<div id="root">', (match) => {
      return match + appHtml;
    })
    // Состояние сервисов, с которым выполнился рендер
    .replace('<head>', (match) => {
      return (
        match +
        `<script type="module">window.initialData=${JSON.stringify(
          stringify(injections?.dump ? injections.dump() : {}),
        )}</script>`
      );
    });

  const httpStatus = injections?.httpStatus?.() || { status: 200 };

  console.log('- render success', httpStatus);

  return {
    html,
    status: httpStatus.status,
    location: httpStatus.location,
    params,
  };
}
