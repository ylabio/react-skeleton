import express from 'express';
import path from 'path';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter, matchPath} from 'react-router-dom';
import {Provider} from 'react-redux';
import Helmet from 'react-helmet';
import createStore from './store/store';
import http from './utils/http.js';
import config from './config';
import routes from './routes';
import {objectUtils} from './utils';
import App from './containers/app-server';

const app = express();
const store = createStore();
http.init(store);

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/*', (req, res) => {
  // request icons (ex. favicon.ico)
  if (req.url.indexOf('.ico') > 0) {
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    res.end();
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    webpackIsomorphicTools.refresh();
  }

  const context = {};
  const dataRequirements =
    filterRoutes(req.url, routes) // filter matching paths
      .map(route => ({component: route.component, params: route.params})) // map to components
      .filter(comp => comp.component.initServer) // check if components have data requirement
      .map(comp => comp.component.initServer({dispatch: store.dispatch, params: comp.params, req})); // get data requirement

  // render page anyway - successful or failure
  Promise.all(dataRequirements).finally(() => {
    const jsx = (
      <Provider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App/>
        </StaticRouter>
      </Provider>
    );
    const reactDom = renderToString(jsx);
    const reduxState = store.getState();
    const helmetData = Helmet.renderStatic();

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(htmlTemplate(reactDom, reduxState, helmetData));
  });
});

app.listen(config.server.port);
console.log(`Server run on http://${config.server.host}:${config.server.port}`);

function htmlTemplate(reactDom, reduxState, helmetData) {
  const {assets} = webpackIsomorphicTools.assets();
  let styles = '';
  Object.keys(assets).forEach((key) => {
    if (key.indexOf('.less') > 0 || key.indexOf('.scss') > 0 || key.indexOf('.css') > 0) {
      styles += assets[key];
    }
  });

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <base href="/">
            <meta charset="utf-8">
            ${helmetData.title.toString()}
            ${helmetData.meta.toString()}
            ${styles ? '<style type="text/css">' + styles + '</style>' : ''}
        </head>
        
        <body>
            <div id="app">${reactDom}</div>
            <script>
                window.REDUX_DATA = ${JSON.stringify(reduxState)}
            </script>
            <script type="text/javascript" src="main.js"></script>
        </body>
        </html>
    `;
}

function filterRoutes(url, routes, result = []) {
  objectUtils.objectToArray(routes).forEach((route) => {
    const match = matchPath(url, route);
    if (match) {
      route.params = match.params;
      result.push(route);
    }
    if (route.children) {
      result = filterRoutes(url, routes.children, result);
    }
  });
  return result;
}
