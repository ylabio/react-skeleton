export interface IApiConfig {
  default?: {
    baseURL: string,
    headers?: any,
    auth?: Record<string, any>;
  },
  endpoints?: {
    users: Record<string, any>;
    ssr: Record<string, any>;
  },
  url?: string;
};

export interface IStoreConfig {
  log: boolean;
  preloadState: Record<string, any>;
  states: {
    session: {
      tokenHeader: string;
    },
    articles: Record<string, any>;
  }
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