import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useFlow from "@utils/use-flow";
import * as actions from "@store/actions";
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from "@containers/header-container";
import LayoutPage from "@components/layouts/layout-page";
import ArticleList from "@containers/article-list";
import CategoryTree from "@containers/category-tree";

const Catalog = React.memo((props) => {

  const {categoryId} = useParams();

  // Загрузка и обновление списка товаров при выборе категории
  useEffect(()=>{
    actions.articles.load({
      fields: '*,category(title),maidIn(title)',
      search: {category: categoryId}
    });
    return () => {
      actions.articles.reset();
    }
  }, [categoryId]);

  // Загрузка категорий
  useEffect(()=>{
    actions.categories.load({fields: '*', limit: 1000});
  }, []);

  return (
    <LayoutPage header={<HeaderContainer/>}>
      <LayoutContent>
        <h1>Каталог</h1>
        <CategoryTree/>
        <hr/>
        <ArticleList/>
      </LayoutContent>
    </LayoutPage>
  );
});

export default Catalog;
