import React from 'react';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from "@containers/header-container";
import LayoutPage from "@components/layouts/layout-page";
import CategoryEditTree from '@containers/category-edit-tree';
import * as actions from "@store/actions";
import useActions from "@utils/use-actions";

const Categories = React.memo((props) => {

    useActions(async () => {
        await actions.categories.load({fields: '*', limit: 1000});
    });

  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>Категории</h1>
        <p>Отображение древовидного списка категорий для тестового задания.</p>
        <CategoryEditTree/>
      </LayoutContent>
    </LayoutPage>
  );
});

export default Categories;
