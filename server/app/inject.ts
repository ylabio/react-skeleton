import { injectClass } from '../../packages/container/utils.ts';
import { App } from './index.ts';
import { APP, APP_CFG } from './token.ts';
import { PROXY } from '../../packages/proxy/token.ts';
import { ENV } from '../../packages/env/token.ts';
import { VITE_DEV } from '../../packages/vite-dev/token.ts';
import { SSR } from '../../packages/ssr/token.ts';

export const app = injectClass({
  token: APP,
  constructor: App,
  depends: {
    env: ENV,
    config: APP_CFG,
    proxy: PROXY,
    vite: VITE_DEV,
    ssr: SSR
  }
});
