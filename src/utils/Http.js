import CONFIG from '../config.js';
import axios from 'axios';

const Http = axios.create({
  baseURL: CONFIG.baseUrl,
  headers: {}
});

export default Http;