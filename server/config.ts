import {IServerConfig} from "./types";
import proxyConfig from "../proxy.config";

export default (env: ImportMetaEnv): IServerConfig => {
  const config: IServerConfig = {
    // HTTP сервер для рендера. Параметры также используются для dev сервера Vite
    server: {
      host: env.HOST || 'localhost',
      port: env.PORT || 8050,
    },
    proxy: {
      enabled: true,//env.PROD, //В dev режиме работает прокси Vite(в режиме middleware), но у него ошибка на POST запросы, поэтому включен свой прокси
      routes: proxyConfig(env)
    },
    render: {
      // Если отключить, то будет всегда отдаваться SPA
      enabled: true,
      workers: 4,
      // Правила рендера и кэширования страниц.
      // Используется первое правило, удовлетворяющие шаблону url
      rules: [
        {
          // Все адреса
          url: '/*',
          ssr: true,
          // Ждём рендер в DEV режиме
          ssrWait: env.DEV,
          // Отправлять старый кэш вместо spa (если нет ssrWait)
          ssrSendAged: true,
          // Срок кэша на сервере в секундах. По истечении выполняется перерендер.
          cacheAge: 60 * 15, // 15 минут.
          // Из-за локали в куках используем max-age=0, чтобы браузер всегда узнавал у сервера валидность кэша.
          // Иначе при смене языка и переходе по ссылкам сайта браузер может отобразить свой кэш на старом языке.
          control: `public, max-age=${0}, s-maxage=${0}`,
        },
      ],
      cache: {
        // Подпись для валидации кэша после обновления приложения или запуска в разном режиме
        // При деплое подставляется хэш комита
        signature: `${env.CACHE_SIGNATURE || 'some2'}${env.PROD ? 'P' : 'D'}`,
        // Максимальное количество страниц (кэшей) в оперативной памяти
        // Если кэша нет в пяти, то подгружается в память с диска
        // При достижении лимита первые (старые) записи освобождаются из памяти.
        // Для расчёта: если включен compress, то одна страница весит ~500Kb, без компрессии 2Mb (статистика на момент реализации)
        maxItems: 50,
        // Сжимать кэш в gzip.
        compress: true,
        // Директория для файлов кэша
        dir: './cache'
      },
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
