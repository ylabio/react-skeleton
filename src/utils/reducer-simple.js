import mc from "merge-change";
/**
 * Простой редьсер
 * Срабатывает, если action.type соответствует названию редьсера
 * Единственное действие редюсера - немутабельно смержить текущее состояние с переданным в action.payload
 * @param name {String} Название редьсера
 * @param defaultState {Object} Начальное состояние
 * @return {Function}
 */
export default function reducerSimple(name, defaultState){
  return (state = defaultState, action) => {
    if (name === action.type) {
      return mc.update(state, action.payload);
    }
    return state;
  };
}
