/**
 * Создание обработчиков в виде методов объекта
 * В dispatch() необходимо указывать тип(имя) действия и ключ состояния
 * @param initState Object Начальное состояние
 * @param handlers Object Обработчики дейтсвий
 * @version 1.0
 * @created 06.03.2016
 */
export default function reducer(initState, handlers) {

  return (state = initState, action = {}) => {

    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}