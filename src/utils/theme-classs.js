export default function (basename, themes) {
  const result = {};
  if (themes) {
    if (typeof themes === 'string') {
      result[basename + themes] = true;
    }
    if (Array.isArray(themes)) {
      for (const item of themes) {
        result[basename + item] = true;
      }
    }
  }
  return result;
}