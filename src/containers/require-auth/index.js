import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
import useInit from '@src/utils/hooks/use-init';
import services from "@src/services";

function RequireAuth(props) {

  // Сессия из состояния
  const select = useSelectorMap(state => ({
    session: state.session,
  }));

  useInit(async () => {
    // Вызывается даже если есть сессиия в целях её акутализации
    // Вызов происходит при переходе в роут с друго пути
    await services.store.session.remind();
  });

  if (select.session.wait) {
    // Ожидание инициализации сессии
    return (
      <div>
        <i>Проверка сессии...</i>
      </div>
    );
  } else if (select.session.exists) {
    // Есть доступ
    return props.children;
  } else {
    // Нет доступа - редирект
    // @todo Не работает при SSR
    return <Navigate to={props.redirect} state={{ from: services.navigation.location }} />;
  }
}

RequireAuth.propTypes = {
  children: PropTypes.node,
  redirect: PropTypes.string,
};

RequireAuth.defaultProps = {
  redirect: '/login',
};

export default React.memo(RequireAuth);
