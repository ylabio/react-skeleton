import { injectClass } from '../../packages/container/utils.ts';
import { APP, APP_CFG } from './token.ts';
import { PROXY } from '../../packages/proxy/token.ts';
import { ENV } from '../../packages/env/token.ts';
import { CONFIGS } from '../../packages/configs/token.ts';
import { App } from './index.ts';
import { nestedToken } from '../../packages/token/utils.ts';
import { VITE_DEV } from '../../packages/vite-dev/token.ts';
import { SSR } from '../../packages/ssr/token.ts';

export const AppInject = injectClass({
  token: APP,
  constructor: App,
  depends: {
    env: ENV,
    config: nestedToken(CONFIGS, APP_CFG),
    proxy: PROXY,
    vite: VITE_DEV,
    ssr: SSR
  }
});
