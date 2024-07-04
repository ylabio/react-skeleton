import { newToken } from '../token/utils.ts';
import type { ViteDev } from './index';

export const VITE_DEV = newToken<ViteDev>('@react-skeleton/vite-dev', {
  onCreate: 'init'
});
