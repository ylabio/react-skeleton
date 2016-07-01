import Rest from '../utils/Rest.js';

export default{

    /**
     * Информация о состоянии кружков
     * @returns {axios.Promise}
     */
    load: () => {
        return Rest.get(`/api/grid/`);
    },

    /**
     * Сохранение сетки
     * @param items
     * @returns {axios.Promise}
     */
    update: (items) => {
        return Rest.put(`/api/grid/`, {items});
    }
}