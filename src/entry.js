import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { useRouterHistory, Router } from 'react-router';
import { createHistory } from 'history'

import stores from './stores';
import routes from './routes';

const history = useRouterHistory(createHistory)({});

ReactDOM.render(
    <Provider store={stores}>
        <Router children={routes} history={history}/>
    </Provider>,
    document.getElementById('app')
);