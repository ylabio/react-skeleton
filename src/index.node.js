/**
 * Точка запуска приложения на node.js для SSR.
 * Входные параметры передаются через workerData от главного процесса.
 * Резлультат рендера возвращается через parentPort главному процессу.
 * Приложение запускается отдельно в потоке на каждый запрос для локализации состояния рендера
 */
import React from 'react';
import path from 'path';
import { parentPort, workerData } from 'worker_threads';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import insertText from '@src/utils/insert-text';
import store from '@src/store';
import navigation from '@src/app/navigation';
import api from '@src/api';
import App from '@src/app';
import config from 'config.js';
import template from './index.html';

global.SSR = {
  ...workerData,
  active: true,
  firstRender: false,
  initPromises: [],
};

(async () => {
  api.configure(config.api);
  navigation.configure({ ...config.navigation, initialEntries: [workerData.url] }); // with request url
  store.configure();

  const jsx = (
    <Provider store={store}>
      <Router history={navigation.history}>
        <App />
      </Router>
    </Provider>
  );
  const statsFile = path.resolve('./dist/node/loadable-stats.json');
  const extractor = new ChunkExtractor({ statsFile });
  const jsxExtractor = extractor.collectChunks(<ChunkExtractorManager extractor={extractor}>{jsx}</ChunkExtractorManager>);

  // Первичный рендер для инициализации состояния
  SSR.firstRender = true;
  renderToString(jsx);

  await Promise.all(SSR.initPromises);

  // Обработка рендера с учётом параметров сборки, деления на чанки, динамические подгурзки
  // Итоговый рендер с инициализированным состоянием
  SSR.firstRender = false; // чтобы не работал хук useInit
  const html = renderToString(jsxExtractor);

  // Состояние
  let state = store.getState();
  let scriptState = `<script>window.stateKey="${SSR.stateKey}"</script>`;

  // Метаданные рендера
  const helmetData = Helmet.renderStatic();
  const baseTag = `<base href="${config.navigation.basename}">`;
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
  out = insertText.after(out, '</body>', scriptState + scriptTags);

  parentPort.postMessage({ out, state, status: 200, html, pc: SSR.initPromises.length });
})();

process.on('unhandledRejection', function (reason /*, p*/) {
  parentPort.postMessage({ out: `ERROR: ${reason.toString()}`, status: 500 });
  console.error(reason);
  process.exit(1);
});
