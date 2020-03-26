export default {
  /**
   * Экранирование строки для использования в регулярном выражении
   * @param s
   * @returns {*}
   */
  regex: function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },
};
