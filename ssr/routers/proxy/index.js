import httpProxy from "http-proxy";

export default async ({app, config}) => {

  if (config.proxy.enabled) {
    // // Прокси на внешний сервер по конфигу (обычно для апи)
    const proxy = httpProxy.createProxyServer({/*timeout: 5000, */proxyTimeout: 5000});
    proxy.on('error', function (err, req, res) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(err.toString());
    });

    for (const path of Object.keys(config.proxy.routes)) {
      console.log(`Proxy ${path} => ${config.proxy.routes[path].target}`);
      app.all(path, async (req, res) => {
        try {
          return proxy.web(req, res, config.proxy.routes[path]);
        } catch (e) {
          console.error(e);
          res.send(500);
        }
      });
    }
  }
};
