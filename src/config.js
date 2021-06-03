const isWeb = process.env.TARGET === 'web';

let config = {
  api: {
    // Обычно хост на апи относительный и используется прокси для устранения CORS
    baseURL: isWeb ? '' : 'http://example.front.ylab.io',
    tokenHeader: 'X-Token',
    defaultEndpoint: 'common',
    // Прокси на апи, если режим разработки или ssr без nginx
    proxy: {
      '/api/**': {
        target: 'http://example.front.ylab.io',
        secure: true,
        changeOrigin: true,
      },
    },
  },

  store: {
    preloadState: {},
  },

  navigation: {
    basename: '/', // если фронт доступен по вложенному пути
    type: isWeb ? 'browser' : 'memory',
  },

  // Сервер разработки (локальный для горячего обновления фронта)
  devServer: {
    port: 8031,
  },

  // Сервер для рендера
  renderServer: {
    host: 'localhost',
    port: 8132,
    preloadState: true,
  },

  ssr: {
    maxDepth: 10
  }
};

module.exports = config;
