import uniqid from "uniqid";

export default class StateCache {
  constructor() {
    this.items = new Map();
  }

  makeSecretKey(){
    const key = uniqid();
    const secret = uniqid(key);
    return {key, secret};
  }

  remember({key, secret}, state, time = 15000){
    this.items.set(key, { [secret]: state });
    setTimeout(() => {
      delete this.items.delete(key);
    }, time);
  }

  get({key, secret}){
    let result = {};
    if (this.items.has(key) && this.items.get(key)[secret]) {
      result = this.items.get(key)[secret]
      delete this.items.delete(key);
    }
    return result;
  }
}
