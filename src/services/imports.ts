// Асинхронный импорт сервисов для деления сборки
export default {
  api: () => import('@src/services/api'),
  store: () => import('@src/services/store'),
  suspense: () => import('@src/services/suspense'),
  validator: () => import('@src/services/validator'),

  navigation: () => import('@src/features/navigation/service'),
  modals: () => import('@src/features/modals/service'),
  i18n: () => import('@src/features/i18n/service'),
};
