import uniqid from "uniqid";

export type TSecretKey = {
  key: string;
  secret: string;
}

/**
 * Хранилище состояний, с доступом по двойному ключу (паре строк)
 * Доступ к данным одноразовый.
 * Используется для запоминания состояния, с которым рендерилось приложение.
 */
export default class InitialStore {
  private items: Map<string, {[secret: string]: unknown}>;

  constructor() {
    this.items = new Map();
  }

  makeSecretKey(){
    const key = uniqid();
    const secret = uniqid(key);
    return {key, secret};
  }

  remember({key, secret}: TSecretKey, state: unknown, time = 15000){
    this.items.set(key, { [secret]: state });
    setTimeout(() => {
      //delete this.items.delete(key);
    }, time);
  }

  get({key, secret}: TSecretKey){
    let result = undefined;
    if (this.items.has(key)){
      const record = this.items.get(key);
      if (record){
        result = record[secret];
        this.items.delete(key);
      }
    }
    return result;
  }
}
