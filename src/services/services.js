export default {
  api: () => import(/* webpackChunkName: "service-api" */ '@src/services/api'),
  navigation: () => import(/* webpackChunkName: "service-navigation" */ '@src/services/navigation'),
  store: () => import(/* webpackChunkName: "service-store" */ '@src/services/store'),
  ssr: () => import(/* webpackChunkName: "service-store" */ '@src/services/ssr'),
};
