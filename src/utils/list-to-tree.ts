import _get from 'lodash.get';

/**
 * Преобразование списка в иерархию
 * @param list {Array} Список объектов с отношеним на родителя
 * @param privateKey {String} Свойство с первичным ключём
 * @param parentKey {String} Свойство с ключем на родителя
 * @param childrenKey {String} Свойство-массив, куда добавить отношения на подчиенные объекты
 * @returns {Array} Корневые узлы
 */
export default function listToTree(
  list: any[],
  privateKey = '_id',
  parentKey = 'parent._id',
  childrenKey = 'children',
) {
  let trees: any = {};
  let roots: any = {};
  for (const item of list) {
    // В индекс узлов
    if (!trees[item[privateKey]]) {
      trees[item[privateKey]] = item;
      trees[item[privateKey]][childrenKey] = [];
      // Ещё никто не ссылался, поэтому пока считаем корнем
      roots[item[privateKey]] = trees[item[privateKey]];
    } else {
      trees[item[privateKey]] = Object.assign(trees[item[privateKey]], item);
    }
    // В подчиненные родительского узла
    if (_get(item, parentKey)) {
      if (!trees[_get(item, parentKey)]) {
        trees[_get(item, parentKey)] = { [childrenKey]: [] };
      }
      trees[_get(item, parentKey)][childrenKey].push(trees[item[privateKey]]);
      if (roots[item[privateKey]]) {
        delete roots[item[privateKey]];
      }
    }
  }
  return Object.values(roots);
}
