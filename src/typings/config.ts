import { AxiosBasicCredentials, RawAxiosRequestHeaders, RawAxiosResponseHeaders } from "axios";

export type EndpointsType<T> = any

type BaseEndpointConfig = {
  url?: string;
  baseURL?: string;
  headers?: Partial<RawAxiosRequestHeaders & RawAxiosResponseHeaders>;
  auth?: AxiosBasicCredentials;
}
export interface IApiConfig {
  default?: BaseEndpointConfig,
  endpoints?: EndpointsType<any>,
  url?: string;
};

export interface IStoreConfig {
  log: boolean;
  preloadState: Record<string, any>;
  states: Record<string, any>;
};

export interface INavigationConfig {
  basename?: string;
  type?: string;
  initialEntries?: string[]
};

export interface IDevServerConfig {
  port: number,
  // Прокси на апи, если режим разработки или ssr без nginx
  proxy: {
    [key: string]: {
      target: string,
      secure: boolean,
      changeOrigin: boolean,
    },
  }
};

export interface IRenderServerConfig {
  host: string,
  port: number,
  preloadState: boolean,
}

export interface ISsrConfig {
  maxDepth: number;
  stateKey?: string;
}

export interface IConfig {
  api?: IApiConfig;
  store?: IStoreConfig;
  navigation?: INavigationConfig;
  devServer?: IDevServerConfig;
  renderServer?: IRenderServerConfig;
  ssr?: ISsrConfig;
}