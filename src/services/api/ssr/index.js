export default class Ssr {
  /**
   * @param http {AxiosInstance} Экземпляр библиотеки axios
   * @param path {String} Путь в url по умолчанию
   */
  constructor(http) {
    this.http = http;
  }

  getPreloadState({ key }) {
    // В запросе передаётся ключ состояния
    // Вместе запросом уходит кука secretKey, установленная сервером при отдаче рендера
    // Кука недоступна для чтения из JS
    return this.http.get(`/ssr/state/${key}`, {
      baseURL: '',
    });
  }
}
