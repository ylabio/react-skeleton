/**
 * Точка запуска приложения на node.js для SSR.
 * Входные параметры передаются через workerData от главного процесса.
 * Результат рендера возвращается через parentPort главному процессу.
 * Приложение запускается отдельно в потоке на каждый запрос для локализации состояния рендера
 */
import React from 'react';
import path from 'path';
// import {parentPort, workerData} from 'worker_threads';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import RouterProvider from '@src/containers/router-provider';
import { Helmet } from 'react-helmet';
import Services from '@src/services';
import configDefault from '@src/config.js';
import App from '@src/app';
import template from './index.html';
import insertText from '@src/utils/insert-text';
import ServicesProvider from '@src/services/provider';

export default async (params: any) => {
  // Инициализация менеджера сервисов
  // Через него получаем сервисы ssr, api, navigation, store и другие
  // При первом обращении к ним, они будут автоматически инициализированы с учётом конфигурации
  const services = await new Services().init(configDefault);

  // Корректировка общей конфигурации параметрами запроса (передаются от главного процесса)
  services.configure({
    navigation: {
      // Точка входа для навигации (какую страницу рендерить)
      initialEntries: [params.url],
    },
    ssr: {
      // Все параметры рендера от воркера
      ...params,
    },
  });

  // JSX как у клиента
  const jsx = (
    <ServicesProvider services={services}>
      <RouterProvider navigation={services.navigation}>
        <App />
      </RouterProvider>
    </ServicesProvider>
  );

  // Обертка от loadable-components для корректной подгрузки чанков с динамическим импортом
  const statsFile = path.resolve('./dist/node/loadable-stats.json');
  const extractor = new ChunkExtractor({ statsFile });
  const jsxExtractor = extractor.collectChunks(
    // @ts-ignore
    <ChunkExtractorManager extractor={extractor}>{jsx}</ChunkExtractorManager>,
  );

  // Рендер в строку с ожиданием асинхронных действий приложения
  const html = await services.ssr.render(jsxExtractor);

  // Ключи исполненных ожиданий (чтобы клиент знал, какие действия были выполнены на сервере)
  const keys = services.ssr.getPrepareKeys();

  // Состояние
  const state = services.store.getState();

  // В HTML добавляем ключ всего состояния, которое клиент подгрузит сам по ключу
  const scriptState = `<script>window.stateKey="${services.ssr.getStateKey()}"</script>`;

  // Метаданные рендера
  const helmetData = Helmet.renderStatic();
  const baseTag = `<base href="${configDefault.navigation.basename}">`;
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

  return { out, state, keys, status: 200, html };
};
