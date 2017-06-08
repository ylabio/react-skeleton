import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import stores from './stores';
import App from './views/app/App.js';

ReactDOM.render(
    <Provider store={stores}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
