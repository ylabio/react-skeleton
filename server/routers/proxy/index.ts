import httpProxy from "http-proxy";
import {IRouteContext} from "../../types";

/**
 * Проксирование запросов в соответствии с настройками приложения
 * Обычно проксируются запросы к АПИ для обхода CORS
 * @param app
 * @param config
 */
export default async ({app, config}: IRouteContext) => {

  if (config.proxy.enabled) {
    // // Прокси на внешний сервер по конфигу (обычно для апи)
    const proxy = httpProxy.createProxyServer({/*timeout: 5000, */proxyTimeout: 5000});
    proxy.on('error', function (err, req, res) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(err.toString());
    });

    app.use((req, res, next) => {
      for (const path of Object.keys(config.proxy.routes)) {
        if ((path[0] === '^' && new RegExp(path).test(req.url)) || req.url.startsWith(path)) {
          try {
            return proxy.web(req, res, config.proxy.routes[path]);
          } catch (e) {
            console.error(e);
            res.send(500);
          }
        }
      }
      next();
    });

    console.log(`Proxy in SSR enabled`);
  }
};
