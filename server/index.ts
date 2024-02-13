/**
 * HTTP server for render
 */
import express from "express";
import routers from './routers/index';
import serverConfig from "./config";
import loadEnv from "./utils/loadEnv";
import CacheStore from "./utils/cache-store";

(async () => {
  const env = loadEnv();
  const config = serverConfig(env);
  const cacheStore = new CacheStore(config.render.cache);
  const app = express();
  for (const route of routers) {
    await route({app, cacheStore, config, env});
  }
  app.listen(config.server.port);
  console.info(`Server run on http://${config.server.host}:${config.server.port}`);
})().catch(console.warn);
