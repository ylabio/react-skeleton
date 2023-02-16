import React from 'react';
import propTypes from 'prop-types';
import Services from '@src/services';

/**
 * Контекст для Service
 * @type {React.Context<{}>}
 */
export const ServicesContext: React.Context<Services> = React.createContext({} as Services);

/**
 * Провайдер services.
 * Подключает контекст к приложение для доступа к сервисам.
 * Провайдер не обрабатывает изменения в services.
 */
function ServicesProvider({ services, children }: { services: any, children: React.ReactNode }) {
  console.log(services)
  // В провайдер передатся объект services,
  // после чего services можно получиь через useContext(ServicesContext) в любом компоненте
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

ServicesProvider.propTypes = {
  services: propTypes.object.isRequired,
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]).isRequired,
};

export default React.memo(ServicesProvider);
