import React from 'react';
import propTypes from 'prop-types';

/**
 * Контекст для Service
 * @type {React.Context<{}>}
 */
export const ServicesContext = React.createContext({});

/**
 * Провайдер services.
 * Подключает контекст к приложению для доступа к сервисам.
 * Провайдер не обрабатывает изменения в services.
 */
function ServicesProvider({ services, children }: { services: any, children: React.ReactNode }) {
  // В провайдер передаётся объект services,
  // после чего services можно получить через useContext(ServicesContext) в любом компоненте
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

ServicesProvider.propTypes = {
  services: propTypes.object.isRequired,
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]).isRequired,
};

export default React.memo(ServicesProvider);
