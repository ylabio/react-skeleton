import {TServices} from "@src/services/types";
import Service from "@src/services/service";
import isPromise from "@src/utils/is-promise";
import {TSuspenseConfig, TWaitDump, TWaitRecord, TWaitState} from "./types";

/**
 * Сервис для обработки ожиданий.
 * Используется в хуке useInit совместно с компонентом <Suspense>
 */
class SuspenseService extends Service<TSuspenseConfig, TWaitDump> {
  private state: TWaitState;

  constructor(config: unknown, services: TServices) {
    super(config, services);
    this.state = new Map();
  }

  defaultConfig() {
    return {
      ...super.defaultConfig(),
      enabled: {
        useInit: import.meta.env.SSR // useInit использует suspense для рендера на сервере
      }
    };
  }

  /**
   * Включенные режимы
   */
  get enabled() {
    return this.config.enabled;
  }

  /**
   * Инициализация с использованием дампа состояния
   * @param dump
   */
  init(dump?: unknown) {
    if (dump) {
      this.state = new Map(Object.entries(dump));
    }
  }

  /**
   * Наличие ожидание по ключу
   * @param key
   */
  has(key: string) {
    return this.state.has(key);
  }

  /**
   * Создание ожидания
   * @param key
   * @param promise Промис, завершение которого будет ожидаться
   */
  wait(key: string, promise: Promise<void> | unknown) {
    const _isPromise = isPromise(promise);
    return this.state.set(key, {
      waiting: !_isPromise,
      promise: _isPromise ? promise.then(() => {
        // Снова смотрим в кэш, вдруг запись уже удалили
        if (this.waiting(key)) {
          this.complete(key);
          // Таймер для сброса кеша на случай отсутствия рендера после завершения промиса
          // Например, не дождавшись загрузки данных перешли на другую страницу
          // stateDataFresh.timeout = setTimeout(() => state.delete(key), 10);
        }
      }) : undefined,
      // timeout: setTimeout(() => {
      //
      // })
    });
  }

  /**
   * Успешное завершение ожидания
   * @param key
   */
  complete(key: string) {
    if (this.has(key)) {
      (this.state.get(key) as TWaitRecord).waiting = true;
    }
  }

  /**
   * Удаление ожидания
   * @param key
   */
  delete(key: string) {
    this.state.delete(key);
  }

  /**
   * Проверка статуса ожидания
   * @param key
   */
  waiting(key: string) {
    return this.state.get(key)?.waiting || false;
  }

  /**
   * Выброс исключения, если ожидание ещё не завершено
   * В исключения передаётся промис, чтобы его перехватил компонент <Suspense>
   * @param key
   */
  throw(key: string) {
    if (this.state.get(key)?.promise) {
      throw this.state.get(key)?.promise;
    }
  }

  /**
   * Дамп состояния
   * Обычно используется на сервере, чтобы передать состояние рендера клиенту
   */
  dump() {
    const result = {} as TWaitDump;
    this.state.forEach((value, key) => {
      result[key] = {waiting: value.waiting};
    });
    return result;
  }
}

export default SuspenseService;
