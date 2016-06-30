import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { createHistory } from 'history'

import stores from './stores';
import routes from './routes';

ReactDOM.render(
    <Provider store={stores}>
        <Router children={routes} history={browserHistory}/>
    </Provider>,
    document.getElementById('app')
);