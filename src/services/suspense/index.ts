import Service from "@src/services/service";
import isPromise from "@src/utils/is-promise";
import {TSuspenseConfig, TWaitDump, TWaitRecord, TWaitState} from "./types";

/**
 * Сервис для обработки ожиданий.
 * Используется в хуке useInit совместно с компонентом <Suspense>
 */
class SuspenseService extends Service<TSuspenseConfig, TWaitDump> {
  private state: TWaitState = new Map();

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
  add<P extends Promise<unknown>>(key: string, promise: P): P {
    const _isPromise = isPromise(promise);
    this.state.set(key, {
      waiting: _isPromise,
      // При завершении промиса будет сброс признака waiting
      promise: _isPromise
        ? promise.then(() => this.complete(key)).catch(() => this.complete(key))
        : undefined,
    });
    return promise;
  }

  /**
   * Завершение ожидания
   * Информация про ожидание остаётся, чтобы помнить про его завершенность
   * @param key
   */
  complete(key: string) {
    if (this.has(key)) {
      (this.state.get(key) as TWaitRecord).waiting = false;
    } else {
      this.state.set(key, {waiting: false});
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
   * Статуса ожидания. true - ожидание ещё не завершено, false - завершено
   * @param key
   */
  waiting(key: string) {
    return this.state.get(key)?.waiting || false;
  }

  /**
   * Выброс исключения, если ожидание ещё не завершено
   * Исключением будет promise, чтобы его перехватил компонент <Suspense>
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
