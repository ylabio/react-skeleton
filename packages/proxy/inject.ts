import { injectClass } from '../container/utils.ts';
import { Proxy } from './index.ts';
import { PROXY, PROXY_CFG } from './token.ts';

export const proxy = injectClass({
  token: PROXY,
  constructor: Proxy,
  depends: {
    config: PROXY_CFG
  }
});
