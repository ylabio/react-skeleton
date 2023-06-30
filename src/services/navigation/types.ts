import {BrowserHistoryOptions, MemoryHistoryOptions} from "history";

/**
 * Настройки навигации
 */
export type TNavigationConfig = {
  type?: string,
  basename?: string
} & MemoryHistoryOptions & BrowserHistoryOptions
