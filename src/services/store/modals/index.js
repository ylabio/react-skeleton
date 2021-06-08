import BaseState from "@src/services/store/base";

class ModalsState extends BaseState {

  defaultState() {
    return {
      show: false,
      name: null,
      params: null,
      result: null,
    };
  }

  async open(name, params) {
    return new Promise(resolve => {
      this.updateState({
        name,
        params,
        resolve,
        show: true,
        result: null,
      }, 'Открытие модалки '+name);
    });
  }

  async close(result) {
    const state = this.currentState();
    if (state.resolve) {
      state.resolve(result);
    }
    this.updateState({
      show: false,
      result: result,
      resolve: null,
    }, 'Закрытие модалки');
  }
}

export default ModalsState;
