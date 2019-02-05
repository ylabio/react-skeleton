export default {
  objectToArray: function (object) {
    const result = [];
    for (let prop in object) {
      result.push(object[prop]);
    }
    return result;
  }
};
