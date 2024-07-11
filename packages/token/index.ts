import type { TokenOptions } from './types.ts';
import { newToken } from './utils.ts';

export class Token<Type = any> {
  // Символьное представление токена
  readonly symbol: symbol;
  // Опции токена в формате, совместимом для конвертации в JSON
  readonly options: TokenOptions<Type>;

  /**
   * Конструктор токена
   * @param name Уникальное название токена, например в формате URI
   * @param options Опции токена
   */
  constructor(name: string, options: TokenOptions<Type> = {}) {
    this.symbol = Symbol.for(name);
    this.options = options;
  }

  /**
   * Уникальное значение в строковом формате
   */
  toString(): string {
    return this.symbol.description!;
  }

  isEqual(token: Token): boolean {
    return this.symbol === token.symbol;
  }

  // /**
  //  * Символьное значение токена.
  //  * В символ упаковывается строковое значение токена и от него зависит создание нового символа
  //  * С тем же самым стековым значением будет возвращен тот же самый symbol
  //  */
  // toSymbol(): TokenSym<Type, Options> {
  //   if (!this.#sym) this.#sym = Symbol.for(this.toString()) as TokenSym<Type, Options>;
  //   return this.#sym;
  // }

  // /**
  //  * Выборка всех опций с учётом ссылок на оригинальные токены.
  //  * Возвращается массив опций без их объединения.
  //  */
  // getAllOptions(): Array<Options | undefined> {
  //   const list: Array<Options | undefined>  = [];
  //   let point: Token<Type, Options> | undefined = this;
  //   while (point) {
  //     list.push(point.options);
  //     point = point.base;
  //   }
  //   return list;
  // }
  //
  // /**
  //  * Новая версия токена с сохранением ссылки на оригинальный токен.
  //  * Используется для получения нового экземпляра из DI и с другими опциями
  //  * @param version Суффикс к названию оригинального токена
  //  * @param options Переопределяемые опции
  //  */
  // clone<O extends PartialDeep<Options>>(version: string, options?: O): Token<Type, Options> {
  //   return new Token<Type, Options>(`${this.name}.${version}`, options as Options, this);
  // }
  //
  // inner<T, O>(param: Token<T, O>): Token<O> {
  //   return new Token<O>('', undefined, this);
  // }

  // /**
  //  * Создание (восстановление) токен из строкового формата
  //  * @param str Строчное значение полученное ранее через .toString()
  //  */
  // static parseStr<Type, Options extends TokenOpt = undefined>(str: TokenStr<Type, Options>): Token<Type, Options> {
  //   const params = JSON.parse(str || '{}');
  //   if (params && params.name && params.options) {
  //     return new Token<Type, Options>(
  //       params.name,
  //       params.options,
  //       params.base ? Token.parseStr<Type, Options>(params.base) : undefined
  //     );
  //   }
  //   throw new Error(`Unexpected token string "${str}"`);
  // }
  //
  // /**
  //  * Создание (восстановление) токена из символьного формата
  //  * @param tokenSym Символьное значение полученное ранее через .toSymbol()
  //  */
  // static parseSym<Type, Options extends TokenOpt = undefined>(tokenSym: TokenSym<Type, Options>): Token<Type, Options> {
  //   return Token.parseStr(tokenSym.description as TokenStr<Type, Options>);
  // }
}



const X = newToken<string>('ff');

// const TOKEN_S = newToken<RegExp, {
//   a: string,
//   b: number,
//   c: { n: number, k: number }
// }>('@react-skeleton/super-puper', { a: '222', b: 444, c: { n: 1, k: 2 } });
// const TOKEN_S2 = TOKEN_S.newVersion('sufix', { b: 1, c: { n: 2 } });
//
// console.log(TOKEN_S2);
// console.log(TOKEN_S2.toSymbol());
//
// const t_key = TOKEN_S2.toSymbol();
// const t_str = TOKEN_S2.toString();
// const t_remake = Token.parseStr(t_str);
//
// const toke_x2 = TOKEN_S2.newVersion('1', { b: 1 });
//
// console.log(t_remake.toSymbol() === TOKEN_S2.toSymbol());


