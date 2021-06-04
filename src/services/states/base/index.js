import mc from "merge-change";

class BaseState {

  constructor(config, services) {
    this.config = config;
    this.services = services;
  }

  defaultState() {
    return {};
  }

  updateState(patch = {}){
    this.services.states.store.dispatch({type: this.config.name, payload: patch});
  }

  currentState(){
    return this.services.states.store.getState()[this.config.name];
  }

  resetState(patch = {}){
    this.updateState(mc.update(this.defaultState(), patch));
  }
}

export default BaseState;
