/**
 * Точка запуска приложения на node.js для SSR.
 * Входные параметры передаются через workerData от главного процесса.
 * Результат рендера возвращается через parentPort главному процессу.
 * Приложение запускается отдельно в потоке на каждый запрос для локализации состояния рендера
 */
import React from 'react';
React.useLayoutEffect = React.useEffect;
import RouterProvider from '@src/containers/router-provider';
import { Helmet } from 'react-helmet';
import Services from '@src/services';
import configDefault from '@src/config.js';
import App from '@src/app';
import ServicesProvider from '@src/services/provider';

export async function render(params: any){
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

  // Рендер в строку с ожиданием асинхронных действий приложения
  const html = await services.ssr.render(jsx);

  // Ключи исполненных ожиданий (чтобы клиент знал, какие действия были выполнены на сервере)
  const keys = services.ssr.getPrepareKeys();

  // Состояние
  const state = services.store.getState();

  // Метаданные рендера
  const helmetData = Helmet.renderStatic();

  return {
    html,
    state,
    keys,
    status: 200,
    head: {
      base: `<base href="${configDefault.navigation.basename}">`,
      title: helmetData.title.toString(),
      meta: helmetData.meta.toString(),
      link: helmetData.link.toString(),
    }
  };
}
