import { newToken } from '../../packages/token/utils.ts';
import type { App } from './index.ts';
import type { AppConfig } from './types.ts';

export const APP = newToken<App>('@project/app');

export const APP_CFG = newToken<AppConfig>('@project/app/config');
