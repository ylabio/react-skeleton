/**
 * HTTP server for render
 */
import express from "express";
import InitialStore from "./utils/initial-store";
import routers from './routers/index';
import config from "./config";

(async () => {
  const initialStore = new InitialStore();
  const app = express();
  for (const route of routers) {
    await route({app, initialStore, config});
  }
  app.listen(config.server.port);
})();

process.on('unhandledRejection', function (reason) {
  console.error(reason);
  process.exit(1);
});

console.log(`Server run on http://${config.server.host}:${config.server.port}`);
