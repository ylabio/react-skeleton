import Button from '@src/components/elements/button';
import ArticleList from '@src/containers/article-list';
import React from 'react';

function Main() {

  return (
    <>
      <h1>Главная страница</h1>
      <Button onClick={() => {}}>Test</Button>
      <h1>Каталог</h1>
      <ArticleList />
    </>
  );
}

export default React.memo(Main);
