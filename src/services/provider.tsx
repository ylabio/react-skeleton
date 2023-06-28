import React from 'react';
import propTypes from 'prop-types';
import {TServices} from './types';

/**
 * Контекст для Service
 * @type {React.Context<TServices>}
 */
export const ServicesContext = React.createContext({});

/**
 * Провайдер services.
 * Подключает контекст к приложению для доступа к сервисам.
 * Провайдер не обрабатывает изменения в services.
 */
function ServicesProvider({services, children}: {
  services: TServices,
  children: React.ReactNode
}) {
  // В провайдер передаётся точка доступа на все сервисы - services.
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

ServicesProvider.propTypes = {
  services: propTypes.object.isRequired,
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]).isRequired,
};

export default React.memo(ServicesProvider);
