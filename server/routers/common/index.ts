import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import type { IRouteContext } from '../../types';

/**
 * Общие обработки запроса в express и роут на production файлы.
 * @param app
 * @param config
 * @param env
 */
export default async ({ app, env }: IRouteContext) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Отдача файлов кроме index.html
  if (env.PROD) {
    app.use(express.static(path.resolve(__dirname, '../../../dist/client'), { index: false }));
  }
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(cookieParser());
};
