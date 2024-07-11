import { newToken } from '../token/utils.ts';
import type { Ssr } from './index';
import type { SsrOptions } from './types.ts';

export const SSR = newToken<Ssr>('@react-skeleton/ssr', {
  onCreate: 'init'
});

export const SSR_CGF = newToken<Patch<SsrOptions>>('@react-skeleton/ssr/config');
