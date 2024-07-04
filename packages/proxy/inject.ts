import { CONFIGS } from '../configs/token.ts';
import { injectClass } from '../container/utils.ts';
import { nestedToken } from '../token/utils.ts';
import { Proxy } from './index.ts';
import { PROXY, PROXY_CFG } from './token.ts';

export const ProxyInject = injectClass({
  token: PROXY,
  constructor: Proxy,
  depends: {
    config: nestedToken(CONFIGS, PROXY_CFG)
  }
});
