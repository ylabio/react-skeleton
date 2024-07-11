import express from 'express';
import mc from 'merge-change';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import type { Express, Request, Response } from 'express';
import type { Proxy } from '../../packages/proxy';
import type { Ssr } from '../../packages/ssr';
import type { ViteDev } from '../../packages/vite-dev';
import type { AppConfig } from './types.ts';

export class App {

  protected app: Express;
  protected config: AppConfig;

  constructor(protected depends: {
    env: ImportMetaEnv,
    proxy: Proxy,
    config: Patch<AppConfig>,
    vite: ViteDev,
    ssr: Ssr
  }) {
    this.app = express();
    this.config = mc.merge(this.defaultConfig(), depends.config);
  }

  protected defaultConfig(): AppConfig {
    return {
      host: 'localhost',
      port: 8050,
    };
  }

  async start() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Отдача файлов кроме index.html
    if (this.depends.env.PROD) {
      this.app.use(express.static(path.resolve(__dirname, '../../dist/client'), { index: false }));
    }
    this.app.use(express.json()); // for parsing application/json
    this.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    this.app.use(cookieParser());

    // Проксирование запросов в соответствии с настройками приложения.
    // Используется клиентским приложением для обхода CORS.
    // Если проксирование настроить в nginx, то сервис proxy нужно отключить
    if (this.depends.proxy.isEnabled()) {
      this.app.use(this.depends.proxy.requestHandler);
    }

    // Сборщик Vite клиентского приложения (в режиме разработки), чтобы SSR мог использовать src вместо dist.
    // Подключает обработчики для горячего обновления фронта.
    if (this.depends.vite.isEnabled()) {
      this.app.use(this.depends.vite.middlewares!);
    }

    // Если url на файл, то отдаём 404, чтобы не рендерить приложение из-за него
    // Если файл есть, то запрос обработался бы через express.static или в nginx
    this.app.get(/\.[a-z0-9]+$/u, (req: Request, res: Response) => {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('Not Found');
    });

    // Запросы на страницы клиентского приложения
    this.app.get('/*', (req, res) => {
      this.depends.ssr.requestHandler(req, res);
    });

    this.app.listen(this.config.port);

    console.info(`Server run on http://${this.config.host}:${this.config.port}`);
  }
}
