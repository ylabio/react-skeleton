const SSR = import.meta.env.SSR;
const PROD = import.meta.env.PROD;

const config = {
  api: {
    default: {
      // Обычно хост на апи относительный и используется прокси для устранения CORS
      baseURL: SSR ? 'http://localhost:8132' : '',
      //headers: {},
      //auth:{} base auth
    },
    // Настройки для конкретных модулей api по их названию
    endpoints:{
      users: {},
    }
  },
  store: {
    log: !PROD && !SSR, // false,
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
    type: SSR ? 'memory' : 'browser',
  },
};

export default config;
