import React, { useCallback } from 'react';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
import useInit from "@src/utils/hooks/use-init";
import services from '@src/services';
// import { DatePicker } from 'antd';
//import store from '@src/store';

function Universal(props) {
  const select = useSelectorMap(state => ({}));

  useInit(async () => {
    // Выборка начального списка
    services.store.get('name-from-annotation').init();
  });


  // В props аннотация раздела
  // Инициализация store под раздел
  //store.addReducer('key', )
  // Рендер статики аннотации
  // Рендер таблицы (передаём контейнеру указатель на store) и опции по аннотации

  return <div>{props.name}</div>;
}

export default React.memo(Universal);
