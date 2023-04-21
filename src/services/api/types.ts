import { IServicesModules } from '../types';
import * as allEndpoints from './export';

export type IAllEndpoints = typeof allEndpoints;

export type IEndpointsModules = {
  [P in keyof IAllEndpoints]: InstanceType<IAllEndpoints[P]>
}

export type INameEndpoints = keyof IEndpointsModules;

export interface IEndpoint {
  services: IServicesModules;
  api: any;
  config: any;
}
