/**
 * Нормализация параметров под REST API
 * @param params
 */
export default function queryParams(params) {
  let result = {...params};
  // result.search[key] => result["search[key]"]
  if (result.search) {
    delete result.search;
    const keys = Object.keys(params.search);
    for (const key of keys) {
      if (key.indexOf('search[') !== 0) {
        result[`search[${key}]`] = params.search[key];
      } else {
        result[key] = params.search[key];
      }
    }
  }
  const keys = Object.keys(result);
  for (const key of keys) {
    if (typeof result[key] === 'undefined'){
      delete result[key];
    }
  }
  return result;
}
