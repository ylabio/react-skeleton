/**
 * HTTP server for render
 */
import express from "express";
import InitialStore from "./utils/initial-store";
import routers from './routers/index';
import serverConfig from "./config";
import loadEnv from "./utils/loadEnv";

(async () => {
  const env  = loadEnv();
  const config = serverConfig(env);
  const initialStore = new InitialStore();
  const app = express();
  for (const route of routers) {
    await route({app, initialStore, config, env});
  }
  app.listen(config.server.port);
  console.info(`Server run on http://${config.server.host}:${config.server.port}`);
})().catch(console.warn);
