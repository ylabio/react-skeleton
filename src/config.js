const isWeb = process.env.TARGET === 'web';

let config = {
  dev: {
    port: 8031,
  },
  api: {
    // Обычно хост на апи относительный и используется прокси для устранения CORS
    baseURL: isWeb ? '' : 'http://localhost:8102',
    tokenHeader: 'X-Token',

    // Прокси на апи, если режим разработки или ssr без nginx
    proxy: {
      '/api/**': {
        target: 'http://example.front.ylab.io',
        secure: true,
        changeOrigin: true,
      },
    },
  },

  routing: {
    basename: '/', // если фронт доступен по вложенному пути
    type: isWeb ? 'browser' : 'memory',
  },

  //  Параметры запуска сервера для рендера
  ssr: {
    host: 'localhost',
    port: 8102,
    preloadState: true,
  },
};

module.exports = config;
