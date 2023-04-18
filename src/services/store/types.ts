import * as modules from './exports';

export type IModules = typeof modules

export type IStoreModules = {
  [P in keyof IModules]: InstanceType<IModules[P]>
}

export type IRootState = {
  [P in keyof IStoreModules]: ReturnType<IStoreModules[P]['initState']>
}

export type INameModules = keyof IModules;
