import { injectFabric } from '../container/utils.ts';
import loadEnv from './loadEnv.ts';
import { ENV } from './token.ts';

export const EnvInject = injectFabric({
  token: ENV,
  fabric: () => loadEnv(),
  depends: {}
});
