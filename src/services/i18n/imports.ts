/**
 * Импорт словарей переводов
 * Под каждую локаль массив переводов, чтобы каждый модуль проекта мог дополнить словарь своим набором
 * Импорт словаря, чтобы загружать только нужный.
 * Для асинхронного импорта указывается функция, возвращающая промис от import()
 * Для синхронного импорт прописывается непосредственно объект переводом (импортированный обычным способом)
 */

export default {
  // Переводы по-умолчанию.
  // Все локали наследуют '*'
  '*': {
    'auth': () => import('@src/features/auth/translations/en.json'),
    'example-i18n': () => import('@src/features/example-i18n/translations/en'),
    'example-modals': () => import('@src/features/example-modals/translations/en.json'),
    'navigation': () => import('@src/features/navigation/translations/en.json'),
    'main': () => import('@src/features/main/translations/en.js'),
    'catalog': () => import('@src/features/catalog/translations/en.json'),
  },
  'en-EN': {

  },
  // Код локали и её словари с переводами
  'ru-RU': {
    'auth': () => import('@src/features/auth/translations/ru.json'),
    'example-i18n': () => import('@src/features/example-i18n/translations/ru'), //async import
    'example-modals': () => import('@src/features/example-modals/translations/ru.json'),
    'navigation': () => import('@src/features/navigation/translations/ru.json'),
    'main': () => import('@src/features/main/translations/ru.js'),
    'catalog': () => import('@src/features/catalog/translations/ru.json'),
  }
};
