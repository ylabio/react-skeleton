import Common from './common';
import Users from './users';
import Srr from './ssr';
// Соответствие endpoint'a и классов апи
// Для типового CRUD апи используется общий класс Common
export default {
  common: Common,
  ssr: Srr,
  users: Users,
  articles: Common, // Можно не прописывать, так как сервис API по умолчанию применит класс Common, он указан в конфиге
};
