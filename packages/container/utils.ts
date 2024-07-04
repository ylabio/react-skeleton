import type { InjectClass, InjectFabric } from './types.ts';

export function injectClass<Type, Deps, ExtType extends Type>(
  inject: InjectClass<Type, Deps, ExtType>
): InjectClass<Type, Deps, ExtType> {
  return inject;
}

export function injectFabric<Type, Deps, ExtType extends Type>(
  inject: InjectFabric<Type, Deps, ExtType>
): InjectFabric<Type, Deps, ExtType> {
  return inject;
}

export function isInjectClass<Type, Deps, ExtType extends Type = Type>(
  value: InjectClass<Type, Deps, ExtType> | unknown
): value is InjectClass<Type, Deps, ExtType> {
  return Boolean(value
    && typeof value === 'object'
    && 'token' in value
    && 'depends' in value
    && 'constructor' in value
  );
}

export function isInjectFabric<Type, Deps, ExtType extends Type = Type>(
  value: InjectFabric<Type, Deps, ExtType> | unknown
): value is InjectFabric<Type, Deps, ExtType> {
  return Boolean(value
    && typeof value === 'object'
    && 'token' in value
    && 'depends' in value
    && 'fabric' in value
    && typeof value.fabric === 'function'
  );
}

export function isInject<Type, Deps, ExtType extends Type>(
  value: InjectClass<Type, Deps, ExtType> | InjectFabric<Type, Deps, ExtType> | unknown
): value is InjectFabric<Type, Deps, ExtType> | InjectClass<Type, Deps, ExtType> {
  return isInjectClass(value) || isInjectFabric(value);
}

