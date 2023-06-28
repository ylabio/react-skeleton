import {createServer as createViteServer} from "vite";

export default async function initVite(app, isProduction = false) {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'custom'
    });

    app.use(vite.middlewares);

    return vite;
  }
}
