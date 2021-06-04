/**
 * Точка запуска приложения в браузере.
 * Выполняется монтирование приложения к корневому тегу для программного изменения его DOM.
 * Если браузером загружается результаты серверного рендера, то используется режим hydrate для
 * предотвращения начального перерендера, а также инициализируется состояние, переданное сервером.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import config from 'config.js';
import services from '@src/services';
import App from '@src/app';

let render = ReactDOM.render;

(async () => {
  // Инициализация менеджера сервисов
  // Через него получаем сервисы api, navigation, states и другие
  // При первом обращении к ним, они будут автоматически инициализированы с учётом конфигурации
  await services.init(config);

  // Если есть подготовленные данные, то был серверный рендер
  if (services.ssr.hasPreloadState()) {
    // Получаем всё состояние, с которым рендерился HTML на сервере и передаём его states через конфиг
    services.configure({
      states: {
        preloadedState: await services.ssr.getPreloadState(),
      },
    });
    render = ReactDOM.hydrate;
  }
  render(
    <Provider store={services.states.store}>
      <Router history={services.navigation.history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
})();
