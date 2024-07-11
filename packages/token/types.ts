import type { ExtractMethodNames } from '../common-types/types.ts';
import type { Token } from './index.ts';

/**
 * Токен
 */
export type { Token } from './index.ts';

/**
 * Опции токена
 */
export type TokenOptions<Type> = {
  // Метод, который нужно автоматически вызывать после создания экземпляра.
  // Используется для асинхронной инициализации так как конструктор не может быть асинхронным.
  onCreate?: ExtractMethodNames<Type>
  // Метод, который вызвать перед удалением экземпляра из DI. Можно использовать как деструктор.
  onFree?: ExtractMethodNames<Type>
  // Название метода для выборки значений из Type по вложенному токену.
  onGetNested?: ExtractMethodNames<Type, (subToken: Token<any>) => any>
};

/**
 * Тип, с которым ассоциирован токен
 */
export type ExtractTokenType<T> = T extends TokenAny<infer Type> ? Type : unknown;

/**
 * Map типов из map токенов
 */
export type ExtractTokensTypes<T> = {
  [P in keyof T]: T[P] extends TokenAny<infer Type> ? Type : undefined;
};

/**
 * Вложенный токен.
 * Содержит токен на родительский объект и токен на данные, которые можно выбрать из родительского объекта.
 * Название метода, с помощью которого возможна выборка определяется в опциях родительского токена.
 */
export type TokenNested<T> = { parent: Token, target: Token<T> }

/**
 * Все варианты токенов. Обычный токен или вложенный токен.
 */
export type TokenAny<T> = Token<T> | TokenNested<T>;

