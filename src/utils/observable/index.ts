import {IObservable, TListener} from "@src/utils/observable/types";
/**
 * Абстрактный класс "Слушатель".
 * Можно использовать как пример для реализации интерфейса.
 * Чтобы наделить логикой слушателя через наследование класса.
 */
export abstract class Observable<State> implements IObservable<State> {
  private listeners: TListener<State>[] = [];
  /**
   * Подписка на изменение state
   * @param callback Функция, которая будет вызываться после установки состояния
   * @return Функция для отписки
   */
  subscribe = (callback: TListener<State>) => {
    this.listeners.push(callback);
    // Возвращаем функцию для отписки
    return () => {
      this.listeners = this.listeners.filter((item: TListener<State>) => item !== callback);
    };
  };

  /**
   * Вызываем всех слушателей
   * Обычно вызывается после изменения внутреннего состояния в объекте
   * @param state Новое состояние, которое будет передано слушателям
   */
  notify = (state: State) => {
    for (const listener of this.listeners) listener(state);
  };

  /**
   * Выборка текучего состояния
   */
  getState = (): State => {
    return undefined as State;
  };
}
