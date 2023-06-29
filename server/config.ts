process.env.TARGET = process.env.TARGET || 'node';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const PROD = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV !== 'production';

export default {
  PROD,
  DEV,

  // HTTP сервер для рендера. Параметры также используются для dev сервера Vite
  server: {
    host: 'localhost',
    port: 8050,
  },

  proxy: {
    enabled: PROD, // В DEV режиме будет работать прокси Vite, в PROD прокси сервера рендера
    routes: {
      '/api': {
        target: 'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      },
    }
  },
};
