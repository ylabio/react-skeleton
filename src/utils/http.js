import CONFIG from '../config.js';
import axios from 'axios';

const http = axios.create({
  baseURL: CONFIG.baseUrl,
  headers: {}
});

http.init = async function(store) {
  if (CONFIG.tokenHeader) {
    //Установка заголовков при изменеии токена в store
    let prevToken = store.getState().session.token;
    store.subscribe(() => {
      let newToken = store.getState().session.token;
      if (newToken !== prevToken) {
        if (newToken === null) {
          delete this.defaults.headers[CONFIG.tokenHeader]; // header for token
        } else {
          this.defaults.headers[CONFIG.tokenHeader] = newToken;
        }
        prevToken = newToken;
      }
    });
  }
};

export default http;
