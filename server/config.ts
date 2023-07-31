import {IServerConfig} from "./types";

export default (env: ImportMetaEnv): IServerConfig => {
  const config: IServerConfig = {
    // HTTP сервер для рендера. Параметры также используются для dev сервера Vite
    server: {
      host: env.HOST || 'localhost',
      port: env.PORT || 8050,
    },
    proxy: {
      enabled: true,//env.PROD, //В dev режиме работает прокси Vite(в режиме middleware), но у него ошибка на POST запросы, поэтому включен свой прокси
      routes: {}
    },
    render: {
      enabled: true,
    }
  };
  if (env.API_PATH) {
    config.proxy.routes[env.API_PATH] = {
      target: env.API_URL,
      secure: false,
      changeOrigin: true,
    };
  }
  return config;
};
