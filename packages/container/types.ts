import type { ExtractTokensTypes, Token } from '../token/types';

/**
 * Реэкспорт типа на контейнер
 */
export type { Container } from './index.ts';

/**
 * Инъекция класса.
 * Указывается токен, конструктор и токены зависимости, которые будут переданы в первый аргумент конструктора
 */
export interface InjectClass<Type, Deps, ExtType extends Type> {
  token: Token<Type>,
  depends: Deps,
  constructor: ConstructorWithDepends<ExtType, ExtractTokensTypes<Deps>>,
}

/**
 * Инъекция функции, которая создаст значение сопоставимое с типом токена.
 * Указывается токен, функция и токены зависимости, которые будут переданы в первый аргумент функции
 * Функция может быть асинхронной.
 */
export interface InjectFabric<Type, Deps, ExtType extends Type> {
  token: Token<Type>,
  depends: Deps,
  fabric: FunctionWithDepends<ExtType, ExtractTokensTypes<Deps>>,
}

export type Inject<Type, Deps, ExtType extends Type> = InjectClass<Type, Deps, ExtType> | InjectFabric<Type, Deps, ExtType>;


/**
 * Конструктор, в первый аргумент которого передаются зависимости из DI
 */
export type ConstructorWithDepends<Type, Deps> = new (depends: Deps) => Type

/**
 * Функция, в первый аргумент которого передаются зависимости из DI.
 * Должна вернуть Type. Может быть асинхронной.
 */
export type FunctionWithDepends<Type, Deps> = (depends: Deps) => Type | Promise<Type>
