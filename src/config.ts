import {TServicesConfig} from "@src/services/types";

export default (env : ImportMetaEnv): TServicesConfig => ({
  api: {
    default: {
      // Обычно хост на апи относительный и используется прокси для устранения CORS
      // Но в режиме рендера на сервере необходимо указать полный адрес к АПИ
      baseURL: env.SSR ? env.API_URL : '',
      //headers: {},
      //auth:{} base auth
    },
    // Настройки для конкретных модулей api по их названию
    endpoints: {}
  },
  store: {
    //log: false,
    // Настройки для конкретных модулей состояния по их названиям
    modules: {
      session: {
        tokenHeader: 'X-Token',
      },
    }
  },
});
