import services from '@src/services';

const defaultServerRender = () => {
  return null;
};

/**
 * Обертка над функциональным компонентом, для альтернативного рендера на сервере.
 * Используется, чтобы предотвратить рендер ненужных частей страницы.
 * @param webRender
 * @param serverRender
 * @returns {(function(): *)|*}
 */
export default function ssrPlaceholder(webRender, serverRender = defaultServerRender) {
  if (services.env.IS_NODE) {
    return serverRender;
  } else {
    return webRender;
  }
}
