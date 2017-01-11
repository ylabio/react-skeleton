import Rest from '../utils/Rest.js';

export default{

    /**
     *
     * @returns {axios.Promise}
     */
    login: (login, password) => {
        return Rest.get(`/api/auth/`);
    },

}