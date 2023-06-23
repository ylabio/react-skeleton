import path from "path";
import {fileURLToPath} from "url";
import fs from "fs";
import httpProxy from 'http-proxy';
import {createServer as createViteServer} from "vite";
import express from "express";
import cookieParser from "cookie-parser";
import parse from "html-dom-parser";
import React from "react";
import streamReplace from "stream-replace";

export async function initTemplate(isProduction = false) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return fs.readFileSync(
    path.resolve(__dirname, isProduction ? '../dist/client/index.html' : '../src/index.html'),
    'utf-8',
  );
}

export async function loadRoot(vite, isProduction = false) {
  if (isProduction) {
    return (await import('../dist/server/root.js')).default;
  } else {
    return (await vite.ssrLoadModule('../src/root.tsx')).default;
  }
}

export async function initApp(isProduction = false) {
  const app = express();

  // Отдача файлов кроме index.html
  if (isProduction) {
    app.use(express.static(path.resolve('../dist/client'), {index: false /*dotfiles: 'allow'*/}));
  }
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
  app.use(cookieParser());

  return app;
}

export async function initProxy(app, proxyConfig = {}) {
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

export async function initVite(app, isProduction = false) {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'custom'
    });

    app.use(vite.middlewares);

    return vite;
  }
}

const attrMap = {
  'xml:lang': 'xmlLang',
  'http-equiv': 'httpEquiv',
  'crossorigin': 'crossOrigin',
  'class': 'className'
};

function attrRenames(attr, names = attrMap){
  const keys = Object.keys(attr);
  let result = {};
  for (const key of keys) {
    if (names[key]) {
      result[names[key]] = attr[key];
    } else {
      result[key] = attr[key];
    }
  }
  return result;
}

export function wrapTemplate(Component, template, place = 'app') {
  const domTree = parse(template.trim().replace(/>\s+</ug,'><'));

  let scripts = [];
  let modules = [];

  const buildReactElements = (nodes) => {
    let result = [];
    for (const item of nodes) {
      let children = item.children ? buildReactElements(item.children) : [];
      if (item.type === 'tag') {
        if (item.attribs.id === place) children.push(React.createElement(Component));
        result.push(React.createElement(item.name, attrRenames(item.attribs), ...children));
      } else
      if (item.type === 'text') {
        result.push(item.data);
      } else
      if (item.type === 'script') {
        if (children.length) {
          result.push(React.createElement(item.name, {
            ...attrRenames(item.attribs),
            dangerouslySetInnerHTML: {__html: children.join('')}
          }));
        } else {
          if (item.attribs.type === 'module') {
            modules.push(item.attribs.src);
          } else {
            scripts.push(item.attribs.src);
          }
        }
      }
    }
    return result;
  };

  const result = buildReactElements(domTree);

  return {html: result.at(0), scripts, modules};
}

export function insertHelmet(pipe, helmet){
  return pipe(
    streamReplace(/<title>[^<]*<\/title>/ui, helmet.title.toString())
  ).pipe(
    streamReplace('</head>', helmet.priority.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString() + '</head>')
  );
}
