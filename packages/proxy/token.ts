import { newToken } from '../token/utils.ts';
import type { Proxy } from './index';
import type { ProxyOptions } from './types.ts';

export const PROXY = newToken<Proxy>('@react-skeleton/proxy');

export const PROXY_CFG = newToken<Patch<ProxyOptions>>('@react-skeleton/proxy/configs');

// export function ProxyServiceLazy(){
//   return [PROXY, () => import('./index')];
// }
