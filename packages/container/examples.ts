// import { injectClass, injectFabric } from './utils.ts';
// import {
//   CACHE_STORE,
//   CACHE_STORE_CFG,
//   CACHE_STORE_EXT,
//   CACHE_STORE_I
// } from '../cache-store/token.ts';
// import { CacheStore } from '../cache-store';
// import { CONFIGS } from '../configs/token.ts';
// import { TCacheConfig } from '../cache-store/types.ts';
// import { SSR, SSR_CGF } from '../ssr/token.ts';
// import { Ssr } from '../ssr';
// import { ENV } from '../env/token.ts';
// import { VITE_DEV } from '../vite-dev-service/token.ts';
// import { ViteDevService } from '../vite-dev-service';
// import { SsrOptions } from '../ssr/types.ts';
// import { nestedToken } from '../token/utils.ts';
//
// // Тест инъекций
// // Верно: Токен на интерфейс
// injectClass({
//   token: CACHE_STORE_I, // <----
//   constructor: CacheStore,
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
// injectFabric({
//   token: CACHE_STORE_I, // <----
//   fabric: (dep: { config: TCacheConfig }) => {
//     return new CacheStore(dep);
//   },
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
//
// // Верно: Класс расширенный
// injectClass({
//   token: CACHE_STORE, // <----
//   constructor: CacheStore,
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
// injectFabric({
//   token: CACHE_STORE, // <----
//   fabric: (dep: { config: TCacheConfig }) => {
//     return new CacheStore(dep);
//   },
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
//
// //!!!!!! Неверно: Токен на расширенный класс
// injectClass({
//   token: CACHE_STORE_EXT, // <----
//   constructor: CacheStore,
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
// injectFabric({
//   token: CACHE_STORE_EXT, // <----
//   fabric: (dep: { config: TCacheConfig }) => {
//     return new CacheStore(dep);
//   },
//   depends: {
//     config: nestedToken(CONFIGS, CACHE_STORE_CFG),
//   },
// });
//
// // Верно: расширенная зависимость
// injectClass({
//   token: SSR,
//   constructor: Ssr,
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_EXT, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
// injectFabric({
//   token: SSR,
//   fabric: (dep: {
//     cacheStore: CacheStore,
//     env: ImportMetaEnv,
//     vite: ViteDevService,
//     configs: SsrOptions
//   }) => {
//     return new Ssr(dep);
//   },
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_EXT, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
//
// //!!!!!!!! Неверно: неполная реализация зависимости
// injectClass({
//   token: SSR,
//   constructor: Ssr,
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_I, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
// injectFabric({
//   token: SSR,
//   fabric: (dep: {
//     cacheStore: CacheStore,
//     env: ImportMetaEnv,
//     vite: ViteDevService,
//     configs: SsrOptions
//   }) => {
//     return new Ssr(dep);
//   },
//   depends: {
//     env: ENV,
//     cacheStore: CACHE_STORE_I, // <----
//     vite: VITE_DEV,
//     configs: nestedToken(CONFIGS, SSR_CGF),
//   }
// });
