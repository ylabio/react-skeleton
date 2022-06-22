/**
 * Создание обработчиков в виде методов объекта
 * В dispatch() необходимо указывать тип(имя) действия
 * @param initState Object Начальное состояние
 * @param handlers Object Обработчики дейтсвий
 * @version 1.0
 * @created 06.03.2016
 */
export default function reducer(initState: any, handlers: any[]) {
  return (state = initState, action: any = {}) => {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}
