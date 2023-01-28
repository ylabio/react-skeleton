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
interface IStoreConfig {
  log: boolean;
  preloadState: Record<string, any>;
  states: {
    session: {
      tokenHeader: string;
    },
    articles: Record<string, any>;
  }
};

interface INavigationConfig {
  basename?: string;
  type?: string;
  initialEntries?: string[]
};

interface IDevServerConfig {
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

interface IRenderServerConfig {
  host: string,
  port: number,
  preloadState: boolean,
}

interface ISsrConfig {
  maxDepth: number
}

export interface IConfig {
  api?: IApiConfig;
  store?: IStoreConfig;
  navigation?: INavigationConfig;
  devServer?: IDevServerConfig;
  renderServer?: IRenderServerConfig;
  ssr?: ISsrConfig;
}