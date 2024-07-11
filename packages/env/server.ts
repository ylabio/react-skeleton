import typedVariables from 'dotenv-parse-variables';
import mc from 'merge-change';
import { loadEnv as loadEnvVite } from 'vite';
import { injectValue } from '../container/utils.ts';
import { ENV } from './token.ts';

export const envServer = (envPartial: Patch<ImportMetaEnv> = {}) => injectValue({
  token: ENV,
  value: mc.merge({
    SSR: true,
    MODE: process.env.NODE_ENV || 'development',
    PROD: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
    DEV: Boolean(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'),
    ...typedVariables(
      loadEnvVite(process.env.NODE_ENV || 'production', process.cwd(), '')
    ),
  } as ImportMetaEnv, envPartial),
});
