/**
 * HTTP server for render
 */
import { Container } from '../packages/container';
import { APP } from './app/token.ts';
import { AppInject } from './app/inject.ts';
import { EnvInject } from '../packages/env/inject.ts';
import { CacheStoreInject } from '../packages/cache-store/inject.ts';
import { SsrInject } from '../packages/ssr/inject.ts';
import { ProxyInject } from '../packages/proxy/inject.ts';
import { ConfigsInject } from '../packages/configs/inject.ts';
import { ViteDevInject } from '../packages/vite-dev/inject.ts';

try {
  // Подключение используемых сервисов в контейнер управления зависимостями
  const container = new Container()
    // Переменные окружения
    .set(EnvInject)
    // Настройки для всех сервисов
    .set(ConfigsInject)
    // Сервис проксирования к АПИ (для локальной отладки prod сборки)
    .set(ProxyInject)
    // Сервис кэширования SSR
    .set(CacheStoreInject)
    // Сборщик Vite для запуска SSR в dev режиме (без сборки)
    .set(ViteDevInject)
    // Сервис рендера (SSR)
    .set(SsrInject)
    // Приложение, определяющее основной флоу
    .set(AppInject);

  const app = await container.get(APP);
  await app.start();

} catch (e) {
  console.error(e);
}
