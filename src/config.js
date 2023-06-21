const isSSR = import.meta.env.SSR;
const isProduction = import.meta.env.PROD;

let config = {
  // Сервис с методами API
  api: {
    default: {
      // Обычно хост на апи относительный и используется прокси для устранения CORS
      baseURL: isSSR ? 'http://localhost:5173' : '',
      //headers: {},
      //auth:{} base auth
    },
    // Настройки для конкретных модулей api по их названиям
    endpoints:{
      users: {

      },
      ssr: {
        baseURL: ''
      }
    }
  },

  // Сервис состояний и действий (redux)
  store: {
    log: !isSSR && !isProduction, // false,
    preloadState: {},
    // Настройки для конкретных модулей состояния по их названиям
    states: {
      session: {
        tokenHeader: 'X-Token'
      },
      articles: {},
    }
  },

  // Сервис навигации
  navigation: {
    basename: '/', // если фронт доступен по вложенному пути
    type: isSSR ? 'memory' : 'browser',
  },

  // // HTTP сервер при разработке (локальный для горячего обновления фронта)
  // devServer: {
  //   port: 8031,
  //   // Прокси на апи, если режим разработки или ssr без nginx
  //   proxy: {
  //     '/api/**': {
  //       target: 'http://example.front.ylab.io',
  //       secure: false,
  //       changeOrigin: true,
  //     },
  //   },
  // },

  // // HTTP сервер для рендера
  // renderServer: {
  //   host: 'localhost',
  //   port: 8132,
  //   preloadState: true,
  // },

  // Сервис рендера на сервере
  // Также используется на клиенте для учёта результатов серверного рендера
  ssr: {
    maxDepth: 10
  }
};

export default config;
