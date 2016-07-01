import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import App from './views/app/App';
import Main from './views/main/Main';

export default (
    <Route path='/' component={App}>
        <IndexRoute component={Main}/>
    </Route>
);