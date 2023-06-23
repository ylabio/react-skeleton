import React from "react";
import RouterProvider from '@src/containers/router-provider';
import Services from '@src/services';
import App from '@src/app';
import ServicesProvider from '@src/services/provider';
import defaultConfig from '@src/config.js';
import {HelmetProvider} from "react-helmet-async";

export default async function root(config = {}) {

  // Инициализация менеджера сервисов
  // Через services получаем доступ к store, api, navigation и всем другим сервисам
  const services = await new Services().init([defaultConfig, config]);
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
  return {Root, services, head};
}
