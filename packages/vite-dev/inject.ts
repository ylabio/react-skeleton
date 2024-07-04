import { injectClass } from '../container/utils.ts';
import { ENV } from '../env/token.ts';
import { ViteDev } from './index.ts';
import { VITE_DEV } from './token.ts';

export const ViteDevInject = injectClass({
  token: VITE_DEV,
  constructor: ViteDev,
  depends: {
    env: ENV
  }
});
