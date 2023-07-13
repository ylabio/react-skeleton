import * as modals from './imports';

/**
 * Компоненты всех модалок
 */
export type TModalsComponents = typeof modals;
/**
 * Названия всех модалок
 */
export type TModalName = keyof TModalsComponents;
/**
 * Свойства (props) компонентов модалок - первый аргумент функции компонента
 * Gо умолчанию добавляется колбэк close()
 */
export type TModalsProps = {
  [Name in TModalName]: Parameters<TModalsComponents[Name]>[0] & ModalClose<void>
}
/**
 * Параметры открытия модалки для метода open.
 * Берутся из свойств компонента, исключая колбэк close, так как его не надо передавать.
 */
export type TModalsParams = {
  [Name in TModalName]: Omit<TModalsProps[Name], 'close'>
}
/**
 * Результат закрытия модалки.
 * Берется первый параметр из колбэка close, так как в close передаются результаты
 */
export type TModalsResult = {
  // [Name in TModalName]: TModalsProps[Name] extends {close: (...args: any) => any}
  //   // Если в свойствах модалки есть колбэк close, то используем его первый аргумент
  //   ? Parameters<TModalsProps[Name]['close']>[0]
  //   : void
  [Name in TModalName]: Parameters<TModalsProps[Name]['close']>[0]
}
/**
 * Свойства модалки с колбэком закрытия
 * Для определения props в компоненте модалки
 */
export interface ModalClose<Result = boolean> {
  close: (result: Result) => void;
}
/**
 * Состояние открытой модалки в стеке
 */
export type TModalState<Name extends TModalName> = {
  key: number,
  name: Name,
  props: TModalsProps[Name],
}
/**
 * Стек открытых модалок
 */
export type TModalsStack = TModalState<TModalName>[];
