import { injectClass } from '../container/utils.ts';
import { ViteDev } from './index.ts';
import { ENV } from '../env/token.ts';
import { VITE_DEV } from './token.ts';

export const viteDev = injectClass({
  token: VITE_DEV,
  constructor: ViteDev,
  depends: {
    env: ENV
  }
});
