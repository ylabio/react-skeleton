import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import MainPage from './views/main-page/MainPage';
import App from './views/app/App';

export default (
    <Route path='/' component={App}>
        <IndexRoute component={MainPage}/>
    </Route>
);