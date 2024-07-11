import { CONTAINER } from '../container/token.ts';
import { injectClass } from '../container/utils.ts';
import { ENV } from '../env/token.ts';
import { Configs } from './index.ts';
import { CONFIGS } from './token.ts';

export const ConfigsInject = injectClass({
  token: CONFIGS,
  constructor: Configs,
  depends: {
    env: ENV,
    container: CONTAINER
  }
});
