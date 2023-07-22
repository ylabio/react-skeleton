/// <reference types="vite/client" />

/**
 * Переменные окружения из .env и process.env
 */
interface Env {
  [key: string]: any,
  // Базовый URL приложения, обычно /
  BASE_URL: string,
  // Хост адрес сервера.
  HOST: string,
  // Порт сервера
  PORT: number,
  // Адрес API сервера, используется для проксирования
  API_URL: string,
  API_PATH: string,
}

/**
 * Переменные окружения, расширенные приложением и сборщиком Vite
 */
interface ImportMetaEnv extends Env{
  //
  SSR: boolean, // Запуск в Node.js
  PROD: boolean, // MODE==production
  DEV: boolean, // MODE!=production
  MODE: string, // production, development and others
  // Информация о запросе при SSR (добавит сервер)
  req?: {
    url: string,
    headers: Record<string, string>,
    cookies: Record<string, string>,
  },
  // more env variables...
}
