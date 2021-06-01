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
import store from '@src/store';
import api, { ssr as ssrApi } from '@src/api';
import navigation from '@src/app/navigation';
import App from '@src/app';
import config from 'config.js';

window.SSR = {
  active: false,
  firstRender: false,
};

(async () => {
  api.configure(config.api);
  navigation.configure(config.navigation);

  let reactRender;
  let preloadedState = {};
  // Если есть stateKey, то включен режим серверного рендера
  if (window.stateKey) {
    SSR.active = true;
    SSR.firstRender = true;
    // Получаем всё состояние, с которым рендерился html по stateKey, для безопасности ещё используется stateSecret в куках
    preloadedState = (await ssrApi.getInitState({ key: window.stateKey })).data;
    reactRender = ReactDOM.hydrate;
  } else {
    reactRender = ReactDOM.render;
  }
  store.configure(preloadedState);

  reactRender(
    <Provider store={store}>
      <Router history={navigation.history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
})();
