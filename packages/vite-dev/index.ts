import { createServer, type ViteDevServer } from 'vite';

export class ViteDev {
  private vite: ViteDevServer | undefined;

  constructor(protected depends: {
    env: ImportMetaEnv
  }) {}

  async init() {
    if (this.depends.env.DEV) {
      this.vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
      });
    }
  }

  isEnabled(): boolean {
    return !!this.vite;
  }

  get middlewares() {
    return this.vite?.middlewares;
  }

  async ssrLoadModule(path: string) {
    if (this.vite) {
      return (await this.vite.ssrLoadModule(path)).default;
    }
    return undefined;
  }

  async transformIndexHtml(url: string, html: string): Promise<string | undefined> {
    if (this.vite) {
      return (await this.vite.transformIndexHtml(url, html));
    }
    return undefined;
  }
}
