import params from '@src/utils/query-params';

export default class Ssr {
  /**
   * @param http {AxiosInstance} Экземпляр библиотеки axios
   * @param path {String} Путь в url по умолчанию
   */
  constructor(http) {
    this.http = http;
  }

  getInitState({ key }) {
    return this.http.get(`/ssr/state/${key}`, {
      baseURL: '',
    });
  }
}
