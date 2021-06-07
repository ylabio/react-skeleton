const isWeb = process.env.TARGET === 'web';

let config = {
  // Сервис с методами API
  api: {
    // Обычно хост на апи относительный и используется прокси для устранения CORS
    baseURL: isWeb ? '' : 'http://example.front.ylab.io',
    tokenHeader: 'X-Token',
    defaultName: 'common',
    // Прокси на апи, если режим разработки или ssr без nginx
    proxy: {
      '/api/**': {
        target: 'http://example.front.ylab.io',
        secure: true,
        changeOrigin: true,
      },
    },
    users: {
      baseURL: 'http://example.front.ylab.io',
      path: '',
    }
  },

  // Сервис действий и redux состояния
  actions: {
    log: true,
    preloadState: {},
    defaultName: 'base'
  },

  // Сервис навигации
  navigation: {
    basename: '/', // если фронт доступен по вложенному пути
    type: isWeb ? 'browser' : 'memory',
  },

  // HTTP сервер при разработки (локальный для горячего обновления фронта)
  devServer: {
    port: 8031,
  },

  // HTTP сервер для рендера
  renderServer: {
    host: 'localhost',
    port: 8132,
    preloadState: true,
  },

  // Сервис рендера на сервере
  // Также используется на клиенте для учёта результатов серверного рендера
  ssr: {
    maxDepth: 10
  }
};

module.exports = config;
