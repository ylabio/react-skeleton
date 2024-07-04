import { newToken } from '../token/utils.ts';
import type { Configs } from './index';

export const CONFIGS = newToken<Configs>('@react-skeleton/configs', {
  onCreate: 'init',
  onGetNested: 'get',
  singleton: true,
});
