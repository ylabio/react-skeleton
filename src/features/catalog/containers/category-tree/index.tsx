import {memo, useMemo} from 'react';
import {Link} from 'react-router-dom';
import useStoreState from "@src/services/store/use-store-state";
import useServices from "@src/services/use-services";
import Tree from '@src/ui/elements/tree';
import Spinner from "@src/ui/elements/spinner";


function CategoryTree() {

  const {store, router} = useServices();
  const categories = useStoreState('categories');
  const {params} = useStoreState('articles');

  const items = useMemo(() => {
    return [{_id: '', title: 'Все'}, ...categories.roots];
  }, [categories.roots]);

  return (
    <Spinner active={categories.wait}>
      <Tree
        items={items}
        renderItem={item => (
          <Link
            style={{fontWeight: params.category === item._id ? 'bold' : 'normal'}}
            state={{refreshArticles: true}} //Чтобы товары перезагрузились на том же адресе
            to={router.makeHref(
              // Учитываем в адресе параметры фильтра, но сбрасываем номер страницы
              store.modules.articles.exportParams({page: 1}, true), `/catalog/${item._id}`
            )}
          >
            {item.title}
          </Link>
        )}
      />
    </Spinner>
  );
}

export default memo(CategoryTree);
