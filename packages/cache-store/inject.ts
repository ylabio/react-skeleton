import { CONFIGS } from '../configs/token.ts';
import { injectClass } from '../container/utils.ts';
import { nestedToken } from '../token/utils.ts';
import { CacheStore } from './index.ts';
import { CACHE_STORE, CACHE_STORE_CFG } from './token.ts';

export const CacheStoreInject = injectClass({
  token: CACHE_STORE,
  constructor: CacheStore,
  depends: {
    config: nestedToken(CONFIGS, CACHE_STORE_CFG),
  },
});
