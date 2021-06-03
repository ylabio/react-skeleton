import React, { useCallback } from 'react';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
// import { DatePicker } from 'antd';
//import store from '@src/store';

function Universal(props) {
  const select = useSelectorMap(state => ({}));



  // В props аннотация раздела
  // Инициализация store под раздел
  //store.addReducer('key', )
  // Рендер статики аннотации
  // Рендер таблицы (передаём контейнеру указатель на store) и опции по аннотации

  return <div>{props.name}</div>;
}

export default React.memo(Universal);
