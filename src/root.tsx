import React from "react";
import {HelmetProvider, HelmetServerState} from "react-helmet-async";
import RouterProvider from '@src/features/navigation/components/router-provider';
import Services from '@src/services';
import App from '@src/app';
import ServicesProvider from '@src/services/provider';
import clientConfig from '@src/config';

export default async function root(envPartial: Partial<ImportMetaEnv> = {}): Promise<RootFabricResult> {
  const env: ImportMetaEnv = {...import.meta.env, ...envPartial};
  // Инициализация менеджера сервисов
  const servicesManager = new Services(env);
  // Через services получаем доступ к store, api, navigation и всем другим сервисам
  const services = await servicesManager.init(clientConfig(env));
  // Контекст для метаданных html
  const head = {};

  const Root = () => (
    <ServicesProvider services={services}>
      <RouterProvider navigation={services.navigation}>
        <HelmetProvider context={head}>
          <App/>
        </HelmetProvider>
      </RouterProvider>
    </ServicesProvider>
  );
  return {Root, servicesManager, head};
};

export type RootFabricResult = {
  Root: React.FunctionComponent,
  servicesManager: Services,
  head: {
    hemlet?: HelmetServerState
  }
};
