import React from "react";
import {createRoot, hydrateRoot} from 'react-dom/client';
import root from "@src/root";

/**
 * Запуск приложения в браузере.
 * Выполняется монтирование корневого react элемента к DOM элементу.
 * Если загружены результаты серверного рендера, то используется режим hydrate,
 * а также устанавливается состояние, с которым выполнялся рендер на сервере.
 */
(async function () {

  const {Root, services} = await root();

  const dom = document.getElementById('app');
  if (!dom) throw new Error('Failed to find the root element');

  // Если есть подготовленные данные от SSR
  if (services.ssr.hasPreloadState()) {
    // Получаем всё состояние, с которым рендерился HTML на сервере и передаём его в сервис store
    services.store.setState(await services.ssr.getPreloadState());
    hydrateRoot(dom, <Root/>);
  } else {
    createRoot(dom).render(<Root/>);
  }
})();
