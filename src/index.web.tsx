/**
 * Точка запуска приложения в браузере.
 * Выполняется монтирование приложения к корневому тегу для программного изменения его DOM.
 * Если браузером загружается результаты серверного рендера, то используется режим hydrate для
 * предотвращения начального перерендера, а также инициализируется состояние, переданное сервером.
 */
import React from 'react';
import {createRoot, hydrateRoot, Root} from 'react-dom/client';
import RouterProvider from '@src/containers/router-provider';
import config from '@src/config';
import Services from '@src/services';
import App from '@src/app';
import ServicesProvider from '@src/services/provider';

(async function () {

  // Инициализация менеджера сервисов
  // Через него получаем сервисы api, navigation, store и другие
  // При первом обращении к ним, они будут автоматически инициализированы с учётом конфигурации
  const services = await new Services().init(config);
  // new Services().init(config).then(() => ...)

  // Метод рендера по умолчанию
  let hydrate = false;

  const app = (
    <ServicesProvider services={services}>
      <RouterProvider navigation={services.navigation}>
        <App />
      </RouterProvider>
    </ServicesProvider>
  );

  const dom = document.getElementById('app');
  if (!dom) throw new Error('Failed to find the root element');

  if (hydrate) {
    hydrateRoot(dom, app);
  } else {
    createRoot(dom).render(app);
  }
})();
