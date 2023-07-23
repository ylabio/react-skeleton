/**
 * Импорт словарей переводов
 * Под каждую локаль массив переводов, чтобы каждый модуль проекта мог дополнить словарь своим набором
 * Импорт словаря, чтобы загружать только нужный
 */
import i18n from '@src/features/i18n/translations/ru.json';

export default {
  // Переводы по-умолчанию.
  // Все локали наследуют '*'
  '*': {
    'common': () => import('@src/features/i18n/translations/en.json'),
    'auth': () => import('@src/features/auth/translations/en.json')
  },
  // Код локали и её словари с переводами
  'en-EN': {

  },
  'ru-RU': {
    //'i18n': i18n //sync import
    'common': () => import('@src/features/i18n/translations/ru.json'), //async import
    'auth': () => import('@src/features/auth/translations/ru.json')
  },
};
