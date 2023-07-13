import StoreModule from "@src/services/store/module";

class ModalsState extends StoreModule<undefined> {

  defaultState() {
    return {
      show: false,
      name: null,
      params: null,
      result: null,
    };
  }

  zz(){
    return true;
  }

  async open(name: string, params: unknown) {
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

  async close(result: unknown) {
    const state = this.getState();
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
