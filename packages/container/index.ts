import { isTokenNested } from '../token/utils.ts';
import { isInjectClass, isInjectFabric } from './utils.ts';
import { hasMethod } from '../utils/has-method';
import type { Token } from '../token';
import type { TokenAny } from '../token/types.ts';
import type { Inject } from './types';

export class Container {
  protected injects: Map<symbol, Inject<any, any, any>> = new Map();
  protected instances: Map<symbol, unknown> = new Map();

  set<Type, Deps, ExtType extends Type>(inject: Inject<Type, Deps, ExtType>): this {
    this.injects.set(inject.token.symbol, inject);
    return this;
  }

  async get<Type>(token: TokenAny<Type>): Promise<Type> {
    // Если токен вложенный, то сначала выборка по родительскому токену
    const baseToken = isTokenNested(token)
      ? token.parent
      : token as Token<Type>;

    // Выбор экземпляра по токену
    let entity = this.instances.get(baseToken.symbol) as Type;

    // Экземпляра ещё нет?
    if (!entity) {
      // Выбор инъекции (информации как создавать экземпляр)
      const inject = this.injects.get(baseToken.symbol);
      if (!inject) throw Error(`Injection by token "${baseToken}" not found`);

      // Выбор зависимостей из контейнера
      const depends: Record<string, any> = {};
      const keys = Object.keys(inject.depends);
      for (const key of keys) {
        const depToken = inject.depends[key];
        try {
          depends[key] = await this.get(depToken);
        } catch (e) {
          console.log(e);
          depends[key] = undefined;
        }
      }

      // Создание экземпляра
      if (isInjectFabric(inject)) {
        entity = (await inject.fabric(depends)) as Type;
      } else if (isInjectClass(inject)) {
        entity = new inject.constructor(depends) as Type;

        // Вызов дополнительного метода, если определен в токене.
        const onCreate = baseToken.options.onCreate;
        if (onCreate && hasMethod(entity, onCreate)) {
          await entity[onCreate]();
        }

      } else {
        throw Error(`Injection by token "${baseToken}" is wrong`);
      }

      // Запоминаем экземпляр, чтобы повторно не создавать.
      this.instances.set(baseToken.symbol, entity);
    }

    // Если токен вложенный, то выборка по целевому токену из entity
    if (isTokenNested(token)) {
      const onGetNested = token.parent.options.onGetNested;
      if (onGetNested && hasMethod(entity, onGetNested)) {
        return await entity[onGetNested](token.target) as Type;
      }
      throw Error(`No method "${onGetNested}(subToken)" in the object taken by token "${token.parent}"`);
    }

    return entity;
  }

  async free<Type>(token: Token<Type>): Promise<void> {
    const entity = this.instances.get(token.symbol);
    if (entity) {
      this.instances.delete(token.symbol);
      const onFree = token.options.onFree;
      if (onFree && hasMethod(entity, onFree)) {
        await entity[onFree]();
      }
    }
  }

  entries() {
    return this.instances.entries();
  }
}
