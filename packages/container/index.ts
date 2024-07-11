import { hasMethod } from '../utils/has-method';
import { CONTAINER } from './token.ts';
import { injectValue, isInjectClass, isInjectFabric } from './utils.ts';
import type { Inject, Injected } from './types';
import type { Token, ExtractTokensTypes } from '../token/types.ts';

export class Container {
  protected injects: Map<symbol, Injected> = new Map();

  constructor() {
    this.set(injectValue({ token: CONTAINER, value: this }));
  }

  set<Type, Deps, ExtType extends Type>(inject: Inject<Type, Deps, ExtType> | Inject[]): this {
    if (!Array.isArray(inject)) inject = [inject];
    inject.forEach(item => this.injects.set(item.token.symbol, { ...item }));
    return this;
  }

  async get<Type>(token: Token<Type>): Promise<Type> {
    const inject = this.injects.get(token.symbol);
    if (!inject) throw Error(`Injection by token "${token}" not found`);

    if ('value' in inject) {
      return inject.value;
    } else {
      // Создание экземпляра (value)
      switch (true) {
        case isInjectFabric(inject): {
          inject.value = (await inject.fabric(await this.getMapped(inject.depends))) as Type;
          break;
        }
        case isInjectClass(inject): {
          inject.value = new inject.constructor(await this.getMapped(inject.depends)) as Type;
          // Вызов дополнительного метода, если определен в токене.
          const onCreate = token.options.onCreate;
          if (onCreate && hasMethod(inject.value, onCreate)) {
            await inject.value[onCreate]();
          }
          break;
        }
        default:
          throw Error(`Injection by token "${token}" is wrong`);
      }
      return inject.value;
    }
  }

  async getMapped<Deps extends Record<string, Token>>(depends: Deps): Promise<ExtractTokensTypes<Deps>> {
    // Выбор зависимостей из контейнера
    const result: Record<string, any> = {};
    const keys = Object.keys(depends);
    for (const key of keys) {
      try {
        result[key] = await this.get(depends[key]);
      } catch (e) {
        console.log(e);
        result[key] = undefined;
      }
    }
    return result as ExtractTokensTypes<Deps>;
  }

  async free<Type>(token: Token<Type>): Promise<void> {
    const inject = this.injects.get(token.symbol);
    if (inject && 'value' in inject && (isInjectFabric(inject) || isInjectClass(inject))) {
      const entity = inject.value;
      delete inject.value;
      const onFree = token.options.onFree;
      if (onFree && hasMethod(entity, onFree)) {
        await entity[onFree]();
      }
    }
  }

  entries() {
    return this.injects.entries();
  }
}
