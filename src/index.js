import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import createStore from './store/store.js';
import App from './containers/app';
import http from './utils/http.js';

import './theme/style.less';

const store = createStore(window.REDUX_DATA);
http.init(store);

ReactDOM.hydrate(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
