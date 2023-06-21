import path from "path";
import {fileURLToPath} from "url";
import fs from "fs";
import httpProxy from 'http-proxy';
import {createServer as createViteServer} from "vite";
import express from "express";
import cookieParser from "cookie-parser";

export async function initTemplate(isProduction = false){
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return fs.readFileSync(
    path.resolve(__dirname, isProduction ? '../dist/client/index.html' : '../src/index.html'),
    'utf-8',
  );
}

export async function initRender(vite, isProduction = false){
  if (isProduction) {
    return (await vite.ssrLoadModule('../src/index.server.tsx')).render;
  } else {
    return (await import('../dist/server/index.server.js')).render;
  }
}

export async function initApp(isProduction  = false){
  const app = express();

  // Отдача файлов кроме index.html
  if (isProduction) {
    app.use(express.static(path.resolve('../dist/client'), { index: false /*dotfiles: 'allow'*/ }));
  }
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(cookieParser());

  return app;
}

export async function initProxy(app, proxyConfig = {}){
  // // Прокси на внешний сервер по конфигу (обычно для апи)
  const proxy = httpProxy.createProxyServer({/*timeout: 5000, */proxyTimeout: 5000});
  proxy.on('error', function (err, req, res) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(err.toString());
  });

  for (const path of Object.keys(proxyConfig)) {
    console.log(`Proxy ${path} => ${proxyConfig[path].target}`);
    app.all(path, async (req, res) => {
      try {
        return proxy.web(req, res, proxyConfig[path]);
      } catch (e) {
        console.error(e);
        res.send(500);
      }
    });
  }

  return proxy;
}

export async function initVite(app){
  const vite = await createViteServer({
    server: {middlewareMode: true},
    appType: 'custom'
  });

  app.use(vite.middlewares);

  return vite;
}
