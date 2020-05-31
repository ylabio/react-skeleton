import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import useSelectorMap from '@utils/hooks/use-selector-map';
import useInit from '@utils/hooks/use-init';
import * as actions from '@store/actions';

function RoutePrivate(props) {
  // Компонент для рендера и параметры роута
  const { component: Component, ...routeProps } = props;

  // Сессия из состояния
  const select = useSelectorMap(state => ({
    session: state.session,
  }));

  useInit(async () => {
    // Вызывается даже если есть сессиия в целях её акутализации
    // Вызов происходит при переходе в роут с друго пути
    await actions.session.remind();
  });

  // Что рендерить роуту в зависимости от состояния сессии
  routeProps.render = useCallback(
    props => {
      if (select.session.wait) {
        // Ожидание иницализации сессии
        return (
          <div>
            <i>Проверка сессии...</i>
          </div>
        );
      } else if (select.session.exists) {
        // Есть доступ
        return <Component {...props} />;
      } else {
        // Нет доступа - редирект
        return <Redirect to={{ pathname: routeProps.failPath, state: { from: props.location } }} />;
      }
    },
    [select, Component],
  );

  return <Route {...routeProps} />;
}

RoutePrivate.propTypes = {
  component: PropTypes.any.isRequired,
  failPath: PropTypes.string,
};

RoutePrivate.defaultProps = {
  failPath: '/login',
};

export default React.memo(RoutePrivate);
