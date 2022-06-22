export default {
  /**
   * Экранирование строки для использования в регулярном выражении
   * @param s
   * @returns {*}ƒ
   */
  regex: function (s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },
};
