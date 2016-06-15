import CONFIG from '../config.js'
import axios from 'axios'

const Rest = axios.create({
    baseURL: CONFIG.baseUrl,
    headers: {

    }
});

export default Rest;