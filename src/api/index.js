import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {},
});

api.configure = function({baseURL, tokenHeader}) {
  if (typeof baseURL !== 'undefined') {
    api.defaults.baseURL = baseURL;
  }
  if (typeof tokenHeader !== 'undefined') {
    api.defaults.tokenHeader = tokenHeader;
  }
};

api.setToken = function(token){
  if (api.defaults.tokenHeader){
    if (token){
      console.log('SET TOKEN', token);
      this.defaults.headers[api.defaults.tokenHeader] = token;
    } else {
      delete this.defaults.headers[api.defaults.tokenHeader];
    }
  }
};

export default api;

/**
 * Reexport API modules
 */

export { default as users } from './users.js';
export { default as articles } from './articles.js';
export { default as categories } from './categories.js';
