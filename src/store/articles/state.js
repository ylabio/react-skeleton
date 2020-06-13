export const types = {
  SET: Symbol('SET'),
};

/**
 * Начальное состояние
 * @type {Object}
 */
export default {
  items: [],
  count: 0,
  params: {
    limit: 20,
    page: 1,
    sort: '-date',
    fields: `items(*,category(title),maidIn(title)), count`,
    categoryId: null,
  },
  wait: false,
  errors: null,
};
