import {memo, useCallback, useMemo} from "react";
import {MenuItem} from "@src/components/navigation/menu/types";
import useServices from "@src/utils/hooks/use-services";
import useSelector from "@src/utils/hooks/use-selector";
import SideLayout from "@src/components/layouts/side-layout";
import Menu from "@src/components/navigation/menu";

function Navigation() {
  const store = useServices().store;

  const select = useSelector(state => ({
    // amount: state.basket.amount,
    // sum: state.basket.sum,
    // lang: state.locale.lang
  }));

  const callbacks = {
    // Обработка перехода на главную
    onNavigate: useCallback((item: MenuItem) => {
      // if (item.key === 3) store.modules.catalog.resetParams();
    }, [store])
  };

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: 'Главная', link: '/', active: false},
      {key: 2, title: 'Модалки', link: '/modals-example', active: false},
      {key: 3, title: 'О нас', link: '/about', active: false},
      {key: 4, title: 'Каталог', link: '/catalog', active: false},
      {key: 5, title: 'Админка', link: '/private', active: false},
    ]), [])
  };

  return (
    <SideLayout side="between">
      <Menu items={options.menu} onNavigate={callbacks.onNavigate}/>
    </SideLayout>
  );
}

export default memo(Navigation);
