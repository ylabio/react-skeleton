import StoreModule from "@src/services/store/module";

class ModalsState extends StoreModule {

  initState() {
    return {
      show: false,
      name: null,
      params: null,
      result: null,
    };
  }

  async open(name: string, params: any) {
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

  async close(result: any) {
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
