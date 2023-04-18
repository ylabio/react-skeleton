import allServices from './export';

export type IServices = typeof allServices

export type IServicesClasses = {
  [P in keyof IServices]: Awaited<ReturnType<IServices[P]>>["default"]
}

export type IServicesModules = {
  [P in keyof IServicesClasses]: InstanceType<IServicesClasses[P]>
}

export type INameServices = keyof IServices;
