import proxyRoutes from '../proxy.js';

process.env.TARGET = process.env.TARGET || 'node';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const PROD = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV !== 'production';

export default {
  PROD,
  DEV,

  // HTTP сервер для рендера
  server: {
    host: 'localhost',
    port: 8132,
  },

  proxy: {
    enabled: PROD, // В DEV режиме будет работать прокси Vite, в PROD прокси сервера рендера
    routes: proxyRoutes
  },
};
