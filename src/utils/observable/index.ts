/**
 * Абстрактный класс "Слушатель".
 * Можно использовать как пример для реализации интерфейса.
 * Чтобы наделить логикой слушателя через наследование класса.
 */
export abstract class Observable {
  protected readonly listeners: Set<() => void> = new Set();
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
   * Обычно вызывается после установки состояния
   */
  protected notify = () => {
    this.listeners.forEach(listener => listener());
  };
}
