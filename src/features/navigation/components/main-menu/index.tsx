import React, {memo, useCallback, useMemo} from "react";
import {MenuItem} from "@src/ui/navigation/menu/types";
import SideLayout from "@src/ui/layout/side-layout";
import Menu from "@src/ui/navigation/menu";
import {Link, useLocation} from "react-router-dom";
import detectActive from "@src/features/navigation/detect-active";
import {useTranslate} from "@src/services/i18n/use-i18n";

function MainMenu() {
  const t = useTranslate();
  const location = useLocation();
  const options = {
    menu: useMemo(() => detectActive([
      {key: 1, title: t('navigation.main-menu.main'), link: '/', active: false},
      {key: 2, title: t('navigation.main-menu.example-modals'), link: '/example-modals', active: false},
      {key: 3, title: t('navigation.main-menu.example-i18n'), link: '/example-i18n', active: false},
      {key: 5, title: t('navigation.main-menu.catalog'), link: '/catalog', active: false},
      {key: 6, title: t('navigation.main-menu.profile'), link: '/profile', active: false},
      {key: 7, title: t('navigation.main-menu.canvas'), link: '/example-canvas', active: false},
    ], location), [t, location.pathname])
  };

  const linkRender = useCallback((item: MenuItem) => (
    <Link to={item.link}>{item.title}</Link>
  ), []);

  return (
    <SideLayout side="between">
      <Menu items={options.menu} linkRender={linkRender}/>
    </SideLayout>
  );
}

export default memo(MainMenu);
