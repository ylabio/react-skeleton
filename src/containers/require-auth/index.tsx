import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useInit from '@src/utils/hooks/use-init';
import useSelector from '@src/utils/hooks/use-selector';
import useServices from '@src/utils/hooks/use-services';
import { NavigateProps } from 'react-router';
import Head from "@src/ui/navigation/head";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/ui/layout/page-layout";

interface Props {
  children?: React.ReactNode;
  redirect: NavigateProps['to']
}

function RequireAuth(props: Props) {
  // Сессия из состояния
  const select: any = useSelector((state: any) => ({
    session: state.session,
  }));

  const services = useServices();

  useInit(async () => {
    // Вызывается даже если есть сессиия в целях её акутализации
    // Вызов происходит при переходе в роут с друго пути
    await services.store.modules.session.remind();
  });

  if (select.session.wait) {
    // Ожидание инициализации сессии
    return (
      <PageLayout>
        <Head title="React Skeleton"></Head>
        <Navigation/>
        <i>Проверка сессии...</i>
      </PageLayout>
    );
  } else if (select.session.exists) {
    // Есть доступ
    return props.children || null;
  } else {
    // Нет доступа - редирект
    // @todo Не работает при SSR
    return <Navigate to={props.redirect} state={{ from: services.navigation.history.location }} />;
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
