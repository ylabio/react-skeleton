export default {
  /**
   * Вставка перед фрагментом
   * @param source
   * @param after
   * @param insert
   * @returns {string|*}
   */
  after: (source, after, insert) => {
    const index = source.indexOf(after);
    if (index !== -1) {
      return source.substr(0, index) + insert + source.substr(index);
    } else {
      return source;
    }
  },

  /**
   * Вставка после фрагмента
   * @param source
   * @param before
   * @param insert
   * @returns {string|*}
   */
  before: (source, before, insert) => {
    let index = source.indexOf(before);
    if (index !== -1) {
      index += before.length;
      return source.substr(0, index) + insert + source.substr(index);
    } else {
      return source;
    }
  },
};
