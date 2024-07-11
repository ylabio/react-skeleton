/**
 * HTTP server for render
 */
import { APP } from './app/token.ts';
import { Container } from '../packages/container';
import { envServer } from '../packages/env/server.ts';
import { app } from './app/inject.ts';
import { cacheStore } from '../packages/cache-store/inject.ts';
import { ssr } from '../packages/ssr/inject.ts';
import { proxy } from '../packages/proxy/inject.ts';
import { viteDev } from '../packages/vite-dev/inject.ts';
import configs from './config.ts';

try {
  // Подключение используемых сервисов в контейнер управления зависимостями
  const services = new Container()
    // Переменные окружения для сервера
    .set(envServer())
    // Настройки для всех сервисов
    .set(configs)
    // Сервис проксирования к АПИ (для локальной отладки prod сборки)
    .set(proxy)
    // Сервис кэширования SSR
    .set(cacheStore)
    // Сборщик Vite для запуска SSR в dev режиме (без сборки)
    .set(viteDev)
    // Сервис рендера (SSR)
    .set(ssr)
    // Приложение, определяющее основной алгоритм работы
    .set(app);

  const appInstance = await services.get(APP);
  await appInstance.start();

} catch (e) {
  console.error(e);
}
