import Service from "@src/services/service";
import {IObservable, TListener} from "@src/utils/observable/types";
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
class ModalsService extends Service implements IObservable<TModalsStack> {
  /**
   * Стек открытых окон
   */
  private state: TModalsStack = [];
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
  open = async<Name extends TModalName>(name: Name, params?: TModalsParams[Name]): Promise<TModalsResult[Name]> => {
    return new Promise(resolve => {
      const key = this.keyGenerator();
      const state = {
        key,
        name,
        props: {
          ...(params || {}),
          close: (result: TModalsResult[Name]) => {
            this.state = this.state.filter(state => state.key !== key);
            this.notify(this.state);
            resolve(result);
          } ,
        } as TModalsProps[Name]
      } as TModalState<Name>;
      this.state = [...this.state, state];
      this.notify(this.state);
    });
  };

  /**
   * Закрытие модалки
   * Теоретически в функции нет необходимости, так как компонент модалки получает колбэк закрытия через свои свойства
   * @param result Результат модалки
   * @param key Ключ модалки. Если не указан, то закрывается последняя открытая.
   */
  close = <Name extends TModalName>(key: number, result: TModalsResult[Name])=> {
    // Находим модалку в стеке и вызываем её close()
    let modalState: TModalState<Name> | undefined;
    if (key) {
      this.state = this.state.filter(state => {
        if (state.key === key) {
          modalState = state as TModalState<Name>;
          return false;
        }
        return true;
      });
    } else {
      modalState = this.state.at(-1) as TModalState<Name>;
    }
    if (modalState) {
      const close = modalState.props.close as ModalClose<TModalsResult[Name]>['close'];
      close(result);
    }
    this.notify(this.state);
  };

  subscribe = (callback: TListener<TModalsStack>) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((item: TListener<TModalsStack>) => item !== callback);
    };
  };

  notify = (state: TModalsStack) => {
    for (const listener of this.listeners) listener(state);
  };

  getState = () => {
    return this.state;
  };
}

export default ModalsService;
