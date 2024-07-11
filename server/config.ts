import proxyConfig from '../proxy.config';
import { PROXY_CFG } from '../packages/proxy/token.ts';
import { CACHE_STORE_CFG } from '../packages/cache-store/token.ts';
import { APP_CFG } from './app/token.ts';
import { SSR_CGF } from '../packages/ssr/token.ts';
import { config } from '../packages/configs/utils.ts';

export default [
  config(APP_CFG, ({ env }) => ({
    host: env.HOST || 'localhost',
    port: env.PORT || 8010,
  })),

  config(PROXY_CFG, ({ env }) => ({
    enabled: true,//env.PROD, //В dev режиме работает прокси Vite(в режиме middleware), но у него ошибка на POST запросы, поэтому включен свой прокси
    routes: proxyConfig(env)
  })),

  config(CACHE_STORE_CFG, ({ env }) => ({
    // Подпись для валидации кэша после обновления приложения или запуска в разном режиме
    // При деплое подставляется хэш комита
    signature: `${env.CACHE_SIGNATURE || 'some2'}${env.PROD ? 'P' : 'D'}`,
    // Максимальное количество страниц (кэшей) в оперативной памяти
    // Если кэша нет в пяти, то подгружается в память с диска
    // При достижении лимита первые (старые) записи освобождаются из памяти.
    maxItems: 50,
    // Сжимать кэш в gzip.
    compress: true,
    // Директория для файлов кэша
    dir: './cache'
  })),

  config(SSR_CGF, ({ env }) => ({
    // Если отключить, то будет всегда отдаваться SPA
    enabled: true,
    // Количество потоков при рендере в prod режиме
    workers: 4,
    // HTML файл, куда вставить результаты рендера
    template: {
      dev: './src/index.html',
      prod: './dist/client/index.html'
    },
    // Файл клиентского приложения, которое рендерить
    clientAppFile: {
      dev: './src/root.tsx',
      prod: './dist/server/root.js'
    },
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
  })),
];
