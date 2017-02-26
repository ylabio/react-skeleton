import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './views/app/App.js'

import stores from './stores';

ReactDOM.render(
    <Provider store={stores}>
        <Router>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('app')
);