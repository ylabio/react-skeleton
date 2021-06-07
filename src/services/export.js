// Асинхронный импорт сервисов для деления сборки
export default {
  api: () => import(/* webpackChunkName: "service-api" */ '@src/services/api'),
  navigation: () => import(/* webpackChunkName: "service-navigation" */ '@src/services/navigation'),
  actions: () => import(/* webpackChunkName: "service-actions" */ '@src/services/actions'),
  ssr: () => import(/* webpackChunkName: "service-ssr" */ '@src/services/ssr'),
};
