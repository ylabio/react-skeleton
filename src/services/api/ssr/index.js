import Endpoint from "@src/services/api/endpoint";

class SsrEndpoint extends Endpoint{

  getPreloadState({ key }) {
    // В запросе передаётся ключ состояния
    // Вместе запросом уходит кука secretKey, установленная сервером при отдаче рендера
    // Кука недоступна для чтения из JS
    return this.request({
      method: 'GET',
      //baseURL: '',
      url: `/ssr/state/${key}`,
    });
  }
}

export default SsrEndpoint;
