import {IServerConfig} from "./types";

export default (env: ImportMetaEnv): IServerConfig => {
  const config: IServerConfig = {
    // HTTP сервер для рендера. Параметры также используются для dev сервера Vite
    server: {
      host: env.HOST || 'localhost',
      port: env.PORT || 8050,
    },
    proxy: {
      enabled: env.PROD, // В DEV режиме будет работать прокси Vite, в PROD прокси сервера рендера
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
