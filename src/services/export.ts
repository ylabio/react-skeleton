// Асинхронный импорт сервисов для деления сборки
export default {
  api: () => import('@src/services/api'),
  navigation: () => import('@src/services/navigation'),
  store: () => import('@src/services/store'),
  suspense: () => import('@src/services/suspense'),
  validator: () => import('@src/services/validator'),
  modals: () => import('@src/modals/service'),
  i18n: () => import('@src/i18n/service'),
};
