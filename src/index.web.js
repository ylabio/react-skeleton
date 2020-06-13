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
import { Base64 } from 'js-base64';
import store from '@store';
import api from '@api';
import history from '@app/history';
import App from '@app';
import config from 'config.js';

let reactRender;
let preloadedState;
const ssrFirstRender = set => {
  window.SSR_FIRST_RENDER = set;
};
// Если есть PRELOAD_DATA, то считается включенным режим серверного рендера - используются разные методы рендера
if (window['preloadedState']) {
  ssrFirstRender(true);
  preloadedState = JSON.parse(Base64.decode(window['preloadedState']));
  reactRender = ReactDOM.hydrate;
} else {
  reactRender = ReactDOM.render;
}

store.configure(preloadedState);
api.configure(config.api);
history.configure(config.routing);

reactRender(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
    {ssrFirstRender()}
  </Provider>,
  document.getElementById('app'),
);
