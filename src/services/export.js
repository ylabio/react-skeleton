export default {
  api: () => import(/* webpackChunkName: "service-api" */ '@src/services/api'),
  navigation: () => import(/* webpackChunkName: "service-navigation" */ '@src/services/navigation'),
  states: () => import(/* webpackChunkName: "service-store" */ '@src/services/states'),
  ssr: () => import(/* webpackChunkName: "service-store" */ '@src/services/ssr'),
};
