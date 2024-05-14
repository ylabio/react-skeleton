import React from "react";
import {createRoot, hydrateRoot} from 'react-dom/client';
import root from "@src/root";
/**
 * Запуск приложения в браузере.
 * Выполняется монтирование корневого react элемента к DOM элементу.
 * Если загружены результаты серверного рендера, то используется режим hydrate.
 */
(async function () {
  const {Root, servicesManager} = await root();

  const dom = document.getElementById('root');
  if (!dom) throw new Error('Failed to find the root element');

  // Если есть подготовленные данные
  if (servicesManager.hasInitialState()) {
    hydrateRoot(dom, <Root/>);
  } else {
    createRoot(dom).render(<Root/>);
  }
})();
