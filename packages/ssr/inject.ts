import { CACHE_STORE } from '../cache-store/token.ts';
import { CONFIGS } from '../configs/token.ts';
import { injectClass } from '../container/utils.ts';
import { ENV } from '../env/token.ts';
import { nestedToken } from '../token/utils.ts';
import { VITE_DEV } from '../vite-dev/token.ts';
import { Ssr } from './index.ts';
import { SSR, SSR_CGF } from './token.ts';

export const SsrInject = injectClass({
  token: SSR,
  constructor: Ssr,
  depends: {
    env: ENV,
    cacheStore: CACHE_STORE,
    vite: VITE_DEV,
    configs: nestedToken(CONFIGS, SSR_CGF),
  }
});
