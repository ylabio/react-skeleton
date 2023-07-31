import Service from "@src/services/service";
import codeGenerator from "@src/utils/code-generator";
import {
  ModalClose,
  TModalName,
  TModalsParams, TModalsProps,
  TModalsResult,
  TModalsStack, TModalState,
} from "@src/services/modals/types";

/**
 * Сервис модальных окон
 */
class ModalsService extends Service {
  // Слушатели изменений стека модалок
  protected readonly listeners: Set<() => void> = new Set();
  // Генератор ключей для окон
  protected readonly keyGenerator = codeGenerator();
  // Стек открытых окон
  protected stack: TModalsStack = [];

  /**
   * Открытие модалки
   * @param name Название модалки
   * @param params Параметры модалки
   */
  open = async <Name extends TModalName>(name: Name, params?: TModalsParams[Name]): Promise<TModalsResult[Name]> => {
    return new Promise(resolve => {
      const key = this.keyGenerator();
      const state = {
        key,
        name,
        props: {
          ...(params || {}),
          close: (result: TModalsResult[Name]) => {
            this.stack = this.stack.filter(stack => stack.key !== key);
            this.notify();
            resolve(result);
          },
        } as TModalsProps[Name]
      } as TModalState<Name>;
      this.stack = [...this.stack, state];
      this.notify();
    });
  };

  /**
   * Закрытие модалки
   * Теоретически в функции нет необходимости, так как компонент модалки получает колбэк закрытия через свои свойства
   * @param result Результат модалки
   * @param key Ключ модалки. Если не указан, то закрывается последняя открытая.
   */
  close = <Name extends TModalName>(key: number, result: TModalsResult[Name]) => {
    // Находим модалку в стеке и вызываем её close()
    let modalState: TModalState<Name> | undefined;
    if (key) {
      this.stack = this.stack.filter(stack => {
        if (stack.key === key) {
          modalState = stack as TModalState<Name>;
          return false;
        }
        return true;
      });
    } else {
      modalState = this.stack.at(-1) as TModalState<Name>;
    }
    if (modalState) {
      const close = modalState.props.close as ModalClose<TModalsResult[Name]>['close'];
      close(result);
    }
    this.notify();
  };

  getStack = () => {
    return this.stack;
  };

  /**
   * Подписка на изменение стека модалок.
   * Возвращается функция для отписки
   * @param listener
   */
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * Вызываем всех слушателей
   */
  protected notify = () => {
    this.listeners.forEach(listener => listener());
  };
}

export default ModalsService;
