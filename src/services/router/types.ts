import {BrowserHistoryOptions, MemoryHistoryOptions} from "history";

/**
 * Настройки навигации
 */
export type TRouterConfig = {
  type?: string,
  basename?: string
} & MemoryHistoryOptions & BrowserHistoryOptions
