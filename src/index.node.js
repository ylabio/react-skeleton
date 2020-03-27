/**
 * Точка запуска приложения на node.js для SSR.
 * Входные параметры передаются через workerData от главного процесса.
 * Резлультат рендера возвращается через parentPort главному процессу.
 * Приложение запускается отдельно в потоке на каждый запрос для локализации состояния рендера
 */
import React from 'react';
import path from 'path';
import {parentPort, workerData} from 'worker_threads';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {Helmet} from "react-helmet";
import { Base64 } from 'js-base64';
import {ChunkExtractor} from '@loadable/server';
import insertText from '@utils/insert-text';
import store from '@store';
import history from '@app/history';
import api from "@api";
import App from '@app';
import config from 'config.js';
import template from './index.html';

store.configure();
api.configure(config.api);
// @todo возможно токен передаётся в куке, нужно его взять для использования в апи
history.configure({...config.routing, initialEntries: [workerData.url]}); // with request url

const jsx = (
  <Provider store={store}>
    <Router history={history}>
      <App/>
    </Router>
  </Provider>
);


let initPromises = [];
global.pushInitPromise = (promise) => {
  initPromises.push(promise);
};

(async () => {
  // Первичный рендер для инициализации состояния
  global.SSR_FIRST_RENDER = true;
  renderToString(jsx);
  await Promise.all(initPromises);

  // Обработка рендера с учётом параметров сборки, деления на чанки, динамические подгурзки
  const statsFile = path.resolve('./dist/node/loadable-stats.json');
  const extractor = new ChunkExtractor({statsFile});
  const jsxExtractor = extractor.collectChunks(jsx);

  // Итоговый рендер с инициализированным состоянием
  global.SSR_FIRST_RENDER = false;
  const html = renderToString(jsxExtractor);

  // Состояние
  let preloadDataScript = '';
  if (config.ssr.preloadState) {
    const storeState = Base64.encode(JSON.stringify(store.getState()));
    preloadDataScript = `<script>window.preloadedState = '${storeState}'</script>`;
  }

  // Метаданные рендера
  const helmetData = Helmet.renderStatic();
  const baseTag = `<base href="${config.routing.basename}">`;
  const titleTag = helmetData.title.toString();
  const metaTag = helmetData.meta.toString();
  const linkTags = helmetData.link.toString();

// Скрипты, ссылки, стили с учётом параметров сборки
  const scriptTags = extractor.getScriptTags();
  const linkTags2 = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  let out = template;
  out = insertText.before(out, '<head>', baseTag + titleTag + metaTag);
  out = insertText.after(out, '</head>', styleTags + linkTags + linkTags2);
  out = insertText.before(out, '<div id="app">', html);
  out = insertText.after(out, '</body>', preloadDataScript + scriptTags);

  parentPort.postMessage({out, status: 200});
})();

process.on('unhandledRejection', function (reason/*, p*/) {
  parentPort.postMessage({out: 'ERROR', status: 500});
  console.error(reason);
  process.exit(1);
});

