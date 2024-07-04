import { newToken } from '../token/utils.ts';
import type { ICacheStore, TCacheConfig } from './types';

export const CACHE_STORE = newToken<ICacheStore>('@react-skeleton/cache-store');

// Для тестов DI
// export const CACHE_STORE_I = newToken<ICacheStore>('cache-store-interface');

// export const CACHE_STORE_EXT = newToken<CacheStoreExt>('cache-store-ext');

export const CACHE_STORE_CFG = newToken<TCacheConfig>('@react-skeleton/cache-store/config');
