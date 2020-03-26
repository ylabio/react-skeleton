/**
 * HTTP server for render
 */

process.env.TARGET = process.env.TARGET || 'node';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require("path");
const { Worker } = require('worker_threads');
const express= require('express');
const config = require('./src/config.js');

const app = express();
app.use(express.static(path.resolve(__dirname, '../dist/web')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get(/\.[a-z0-9]+$/, (req, res) => {
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('404');
});

app.get('/*', async (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  try {
    const result = await render({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log(e);
    res.end('ERROR');
  }
});
app.listen(config.ssr.port, config.ssr.host);

/**
 * Рендер приложения в отдельном потоке
 * @param params
 * @returns {Promise<Object>}
 */
function render(params){
  return new Promise((resolve, reject) => {
    const worker = new Worker('./dist/node/main.js', { workerData: params });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

console.log(`Server run on http://${config.ssr.host}:${config.ssr.port}`);
