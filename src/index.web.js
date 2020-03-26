import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from '@store';
import api from '@api';
import history from '@app/history';
import App from '@app';
import config from 'config.js';

let reactRender;
let preloadData;

// Если есть PRELOAD_DATA, то включен режим серверного рендера
if (window['PRELOAD_DATA']){
  preloadData = window['PRELOAD_DATA'];
  reactRender = ReactDOM.hydrate;
} else {
  reactRender = ReactDOM.render;
}

store.configure(preloadData);
api.configure(config.api);
history.configure(config.routing);

reactRender(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
