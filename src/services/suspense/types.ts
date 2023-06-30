/**
 * Данные про ожидание
 */
export type TWaitRecord = {
  /**
   * Признак ожидания
   */
  waiting: boolean,
  /**
   * Промис, завершение которого ожидается
   */
  promise?: Promise<unknown>,
  /**
   * Таймаут для автоматического удаления ожидания
   */
  timeout?: ReturnType<typeof setTimeout>
}

/**
 * Состояние всех ожиданий
 */
export type TWaitState = Map<string, TWaitRecord>

/**
 * Дамп всех ожиданий
 * В дамп не передаются промисы и таймеры
 */
export type TWaitDump = {
  [key: string]: Pick<TWaitRecord, 'waiting'>
}

/**
 * Настройки сервиса ожиданий
 */
export type TSuspenseConfig = {
  enabled: {
    useInit: boolean
  }
}
