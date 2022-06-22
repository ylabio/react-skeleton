/**
 * Точка запуска приложения в браузере.
 * Выполняется монтирование приложения к корневому тегу для программного изменения его DOM.
 * Если браузером загружается результаты серверного рендера, то используется режим hydrate для
 * предотвращения начального перерендера, а также инициализируется состояние, переданное сервером.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import RouterProvider from '@src/containers/router-provider';
import configDefault from '@src/config';
import Services from '@src/services';
import App from '@src/app';
import mc from 'merge-change';
import ServicesProvider from '@src/services/provider';

(async function (tagId = 'app', config = {}) {
  // Итоговый конфиг
  config = mc.merge(configDefault, config);

  // Метод рендера по умочланию
  let render = ReactDOM.render;

  // Инициализация менеджера сервисов
  // Через него получаем сервисы api, navigation, store и другие
  // При первом обращении к ним, они будут автоматически инициализированы с учётом конфигурации
  const services = await new Services().init(config);

  // Если есть подготовленные данные от SSR
  if (services.ssr.hasPreloadState()) {
    // Получаем всё состояние, с которым рендерился HTML на сервере и передаём его в сервис store
    services.store.setState(await services.ssr.getPreloadState());
    // Гидрация DOM от SSR
    render = ReactDOM.hydrate;
  }

  render(
    <ServicesProvider services={services}>
      <RouterProvider navigation={services.navigation}>
        <App />
      </RouterProvider>
    </ServicesProvider>,
    document.getElementById(tagId),
  );
})();
