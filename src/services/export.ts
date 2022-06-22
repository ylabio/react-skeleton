// Асинхронный импорт сервисов для деления сборки
export default {
  api: () => import(/* webpackChunkName: "service-api" */ '@src/services/api'),
  navigation: () => import(/* webpackChunkName: "service-navigation" */ '@src/services/navigation'),
  store: () => import(/* webpackChunkName: "service-store" */ '@src/services/store'),
  ssr: () => import(/* webpackChunkName: "service-ssr" */ '@src/services/ssr'),
  spec: () => import(/* webpackChunkName: "service-spec" */ '@src/services/spec'),
};
