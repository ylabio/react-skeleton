/**
 * Функция-слушатель
 * Для подписки в subscribe
 */
export type TListener<State> = (state: State) => void;

/**
 * Функция-отписка.
 * Возвращается при подписке.
 */
export type TUnsubscribe = () => void;

/**
 * Интерфейс "Слушатель".
 * Чтобы реализовать интерфейс в любом классе.
 */
export interface IObservable<State> {
  /**
   * Подписка на изменение state
   * @param callback Функция, которая будет вызываться после установки состояния
   * @return Функция для отписки
   */
  subscribe(callback: TListener<State>): TUnsubscribe;

  /**
   * Вызываем всех слушателей
   * Обычно вызывается после изменения внутреннего состояния в объекте
   * @param state Новое состояние, которое будет передано слушателям
   */
  notify(state: State): void;

  /**
   * Выборка текучего состояния
   */
  getState(): State
}
