import React from "react";
import {HelmetProvider, HelmetServerState} from "react-helmet-async";
import RouterProvider from '@src/services/router/provider';
import Services from '@src/services';
import App from '@src/app';
import ServicesProvider from '@src/services/provider';
import clientConfig from '@src/config';

export default async function root(envPartial: Partial<ImportMetaEnv> = {}): Promise<RootFabricResult> {
  const env: ImportMetaEnv = {...import.meta.env, ...envPartial};
  // Менеджер сервисов
  const servicesManager = new Services(env);
  // Через services получаем доступ к store, api, i18n и всем другим сервисам
  const services = await servicesManager.init(clientConfig(env));
  // Контекст для Helmet
  const helmetCtx = {} as { helmet: HelmetServerState };

  const Root = () => (
    <ServicesProvider services={services}>
      <RouterProvider router={services.router}>
        <HelmetProvider context={helmetCtx}>
          <App/>
        </HelmetProvider>
      </RouterProvider>
    </ServicesProvider>
  );

  const ssr: ServerSideRenderInjections = {
    htmlAttr: () => helmetCtx.helmet.htmlAttributes.toString(),
    bodyAttr: () => helmetCtx.helmet.bodyAttributes.toString(),
    title: () => helmetCtx.helmet.title.toString(),
    head: () => {
      return helmetCtx.helmet.meta.toString() +
        helmetCtx.helmet.link.toString() +
        helmetCtx.helmet.script.toString() +
        helmetCtx.helmet.noscript.toString() +
        helmetCtx.helmet.style.toString();
    },
    dump: () => servicesManager.collectDump()
  };

  return {Root, servicesManager, ssr};
}
