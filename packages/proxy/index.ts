import httpProxy from 'http-proxy';
import Server from 'http-proxy';
import mc from 'merge-change';
import * as http from 'node:http';
import type { ProxyOptions } from './types';

export class Proxy {
  private config: ProxyOptions;
  private proxyServer: Server<http.IncomingMessage, http.ServerResponse>;

  constructor(protected depends: {
    config: Patch<ProxyOptions>
  }) {
    this.config = mc.merge(this.defaultConfig(), depends.config);
    // Прокси на внешний сервер по конфигу (обычно для апи)
    this.proxyServer = httpProxy.createProxyServer({/*timeout: 5000, */proxyTimeout: 5000 });
    this.proxyServer.on('error', function (err, req, res) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err.toString());
    });
  }

  protected defaultConfig(): ProxyOptions {
    return {
      enabled: true,
      routes: {}
    };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  public requestHandler = (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    for (const path of Object.keys(this.config.routes)) {
      if (req.url && ((path[0] === '^' && new RegExp(path).test(req.url)) || req.url.startsWith(path))) {
        try {
          return this.proxyServer.web(req, res, this.config.routes[path]);
        } catch (e) {
          console.error(e);
        }
      }
    }
    next();
  };
}
