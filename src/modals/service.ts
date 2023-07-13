import Service from "@src/services/service";
import {IObservable, TListener} from "@src/utils/observable";
import codeGenerator from "@src/utils/code-generator";
import {
  ModalClose,
  TModalName,
  TModalsParams, TModalsProps,
  TModalsResult,
  TModalsStack, TModalState,
} from "@src/modals/types";

/**
 * Сервис модальных окон
 */
class ModalsService extends Service implements IObservable<TModalsStack> {
  /**
   * Стек открытых окон
   */
  private stack: TModalsStack = [];
  /**
   * Слушатели изменений стека
   */
  private listeners: TListener<TModalsStack>[] = [];
  /**
   * Генератор ключей для окон
   */
  private keyGenerator = codeGenerator();

  /**
   * Открытие модалки
   * @param name Название модалки
   * @param params Параметры модалки
   */
  async open<Name extends TModalName>(name: Name, params?: TModalsParams[Name]): Promise<TModalsResult[Name]> {
    return new Promise(resolve => {
      const key = this.keyGenerator();
      const state = {
        key,
        name,
        props: {
          ...(params || {}),
          close: (result: TModalsResult[Name]) => {
            this.stack = this.stack.filter(state => state.key !== key);
            this.notify(this.stack);
            resolve(result);
          } ,
        } as TModalsProps[Name]
      } as TModalState<Name>;
      this.stack = [...this.stack, state];
      this.notify(this.stack);
    });
  }

  /**
   * Закрытие модалки
   * Теоретически в функции нет необходимости, так как компонент модалки получает колбэк закрытия через свои свойства
   * @param result Результат модалки
   * @param key Ключ модалки. Если не указан, то закрывается последняя открытая.
   */
  close<Name extends TModalName>(key: number, result: TModalsResult[Name]) {
    // Находим модалку в стеке и вызываем её close()
    let modalState: TModalState<Name> | undefined;
    if (key) {
      this.stack = this.stack.filter(state => {
        if (state.key === key) {
          modalState = state as TModalState<Name>;
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
    this.notify(this.stack);
  }

  subscribe(callback: TListener<TModalsStack>) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((item: TListener<TModalsStack>) => item !== callback);
    };
  }

  notify(state: TModalsStack) {
    for (const listener of this.listeners) listener(state);
  }

  get(){
    return this.stack;
  }
}

export default ModalsService;
