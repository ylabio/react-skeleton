import CONFIG from '../config.js';
import axios from 'axios';

const http = axios.create({
  baseURL: CONFIG.baseUrl,
  headers: {}
});

http.init = async function(store) {
  // Установка заголовков при изменеии токена в store
  // let prevToken = store.getState().account.token;
  // store.subscribe(()=> {
  //   let newToken = store.getState().account.token;
  //   if (newToken !== prevToken) {
  //     if (newToken === null) {
  //       delete this.defaults.headers['Authorization']; // header for token
  //     } else {
  //       this.defaults.headers['Authorization'] = newToken;
  //     }
  //     prevToken = newToken;
  //   }
  // });
};

export default http;