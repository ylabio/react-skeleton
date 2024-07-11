import mc from 'merge-change';
import { injectValue } from '../container/utils.ts';
import { ENV } from './token.ts';

export const envClient = (envPartial: Patch<ImportMetaEnv> = {}) => injectValue({
  token: ENV,
  value: mc.merge(import.meta.env, envPartial),
});
