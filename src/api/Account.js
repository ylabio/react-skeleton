import Rest from '../utils/Rest.js';

/**
 * Аккаунт
 */
export default{

    /**
     * Информация о текущем авторизованном пользователе
     * @returns {*}
     */
    current: () => {
        return Rest.get(`/api/account/`);
    }
}