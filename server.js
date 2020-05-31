/**
 * HTTP server for render
 */
process.env.TARGET = process.env.TARGET || 'node';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const { Worker } = require('worker_threads');
const express = require('express');
const httpProxy = require('http-proxy');
const config = require('./src/config.js');

const proxy = httpProxy.createProxyServer({});
const app = express();

// Отдача файлов кроме index.html
app.use(express.static(path.resolve('./dist/web'), { index: false }));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Запросы на файлы, которых нет. Отдача 404, чтобы не рендерить страницу
app.get(/\.[a-z0-9]+$/, (req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('404');
});

// Прокси на внешний сервер по конфигу
for (const path of Object.keys(config.api.proxy)) {
  console.log(`Proxy ${path} => ${config.api.proxy[path].target}`);
  app.all(path, async (req, res) => {
    proxy.web(req, res, config.api.proxy[path]);
  });
}

// Все остальные запросы - рендер страницы
app.get('/*', async (req, res) => {
  try {
    const result = await render({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    res.writeHead(result.status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(result.out);
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('ERROR');
  }
});
app.listen(config.ssr.port, config.ssr.host);

/**
 * Рендер приложения в отдельном потоке
 * Запускается сборка приложения специально сделанная для node.js
 * @param params
 * @returns {Promise<Object>}
 */
function render(params) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./dist/node/main.js', { workerData: params });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

console.log(`Server run on http://${config.ssr.host}:${config.ssr.port}`);
