import {TServicesConfig} from "@src/services/types";

const SSR = import.meta.env.SSR;
const PROD = import.meta.env.PROD;

const config:TServicesConfig = {
  api: {
    default: {
      // Обычно хост на апи относительный и используется прокси для устранения CORS
      // Но в режиме рендера на сервере необходимо указать полный адрес к АПИ
      baseURL: SSR ? 'http://example.front.ylab.io' : '',
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
        tokenHeader:'X-Token',
      },
      articles: {},
    }
  },
  // Сервис навигации
  navigation: {
    basename: '/', // если фронт доступен по вложенному пути
  },
};

export default config;
