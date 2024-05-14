type Services = import('@src/services').default;

type HTTPStatus = {
  status: number,
  location?: string
}

type ServerSideRenderInjections = {
  // Замена аттрибутов тега <html>
  htmlAttr?: (attributes: string) => string,
  // Замена аттрибутов тега <body>
  bodyAttr?: (attributes: string) => string,
  // Замена тега <title>
  title?: (text: string) => string,
  // Вставка тегов внутри <head>
  head?: () => string,
  // Вставка тегов внутри <body> в конце
  body?: () => string,
  // Данные (состояние) с которыми выполнилось приложение
  dump?: () => object,
  // HTTP status страницы
  httpStatus?: () => HTTPStatus
}

type RootFabricResult = {
  // React компонент приложения
  Root: React.FunctionComponent,
  // Менеджер сервисов
  servicesManager: Services,
  // Опция рендера на сервере
  injections?: ServerSideRenderInjections
};

type RootFabric = (envPartial: Partial<ImportMetaEnv>) => Promise<RootFabricResult>
