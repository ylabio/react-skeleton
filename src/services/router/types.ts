import {BrowserHistoryOptions, MemoryHistoryOptions} from "history";
import {NavigateProps} from "react-router-dom";

/**
 * Настройки навигации
 */
export type TRouterConfig = {
  type?: string,
  basename?: string
} & MemoryHistoryOptions & BrowserHistoryOptions

export type NavigateSSRProps = NavigateProps & {
  httpStatus?: number
}
