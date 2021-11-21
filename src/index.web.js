/**
 * Точка запуска приложения в браузере.
 * Выполняется монтирование приложения к корневому тегу для программного изменения его DOM.
 * Если браузером загружается результаты серверного рендера, то используется режим hydrate для
 * предотвращения начального перерендера, а также инициализируется состояние, переданное сервером.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider as StoreProvider} from 'react-redux';
import RouterProvider from "@src/containers/router-provider";
import configDefault from 'config.js';
import services from '@src/services';
import App from '@src/app';
import mc from 'merge-change';

export async function start(tagId = 'app', config = {}) {
  // Итоговый конфиг
  config = mc.merge(configDefault, config);

  // Метод рендера по умочланию
  let render = ReactDOM.render;

  // Инициализация менеджера сервисов
  // Через него получаем сервисы api, navigation, store и другие
  // При первом обращении к ним, они будут автоматически инициализированы с учётом конфигурации
  await services.init(config);

  // Если есть подготовленные данные от SSR
  if (services.ssr.hasPreloadState()) {
    // Получаем всё состояние, с которым рендерился HTML на сервере и передаём его в сервис store через конфиг
    services.configure({
      store: {
        preloadedState: await services.ssr.getPreloadState(),
      },
    });
    // Гидрация DOM от SSR
    render = ReactDOM.hydrate;
  }

  render(
    <StoreProvider store={services.store.redux}>
      <RouterProvider navigation={services.navigation}>
        <App/>
      </RouterProvider>
    </StoreProvider>,
    document.getElementById(tagId),
  );
}
