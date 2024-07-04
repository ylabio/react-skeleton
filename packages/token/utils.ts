import { Token } from './index.ts';
import type { TokenNested, TokenOptions } from './types.ts';

/**
 * Создание токена.
 * Обязательно указать тип Type, с которым ассоциируется токен. Если используются опции в токене, то
 * указать тип для них в Options
 * ```ts
 *   const SIMPLE_TOKEN = newToken<TSimple>('@project-name/simple');
 *   const SOME_TOKEN = newToken<TSome, TSomeOptions>('@project-name/some', {onCreate: 'init', singleton: false});
 * ```
 * @param name Уникальное название токена, например в формате URI
 * @param options Опции токена
 */
export function newToken<Type>(name: string, options: TokenOptions<Type> = {}): Token<Type> {
  return new Token<Type>(name, options);
}

/**
 * Создания вложенных токенов.
 * Воженные токены используются, чтобы сначала выбрать объект из DI, а после значение из объекта по второму токену.
 * @param parent Токен на родительский объект
 * @param target Токен на целевое значение из родительского объекта
 */
export function nestedToken<Type>(parent: Token, target: Token<Type>): TokenNested<Type> {
  return { parent, target: target };
}

export function isToken<Type>(
  value: Token<Type> | unknown
): value is Token<Type> {
  return Boolean(value
    && typeof value === 'object'
    && 'symbol' in value
    && typeof value.symbol === 'symbol'
  );
}

export function isTokenNested<Type>(
  value: TokenNested<Type> | unknown
): value is TokenNested<Type> {
  return Boolean(value
    && typeof value === 'object'
    && 'parent' in value
    && 'target' in value
    && isToken(value.parent)
    && isToken(value.target)
  );
}

