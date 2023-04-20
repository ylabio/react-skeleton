/**
 * Нормализация параметров под REST API
 * @param params
 */
export default function queryParams(params: { [key: string]: any }) {
  let result = { ...params };
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
  if (result.sort) {
    if (typeof result.sort !== 'string') {
      result.sort =
        Object.entries(result.sort)
          .map(([key, value]: [string, any]) => `${value.order === 'asc' ? '' : '-'}${key}`)
          .join(',') || undefined;
    }
  }
  const keys = Object.keys(result);
  for (const key of keys) {
    if (typeof result[key] === 'undefined') {
      delete result[key];
    }
  }
  return result;
}
