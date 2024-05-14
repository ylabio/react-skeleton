import { parentPort } from 'worker_threads';
import render, { type RenderParams } from './render';

if (parentPort) {
  const clientAppFile = '../../../dist/server/root.js';
  const clientApp = (await import(clientAppFile)).default;

  // Обработка команд от основного потока
  parentPort.on('message', async (message) => {
    if (message && typeof message === 'object' && parentPort) {
      switch (message.name) {
        // Рендер
        case 'render': {
          const params: RenderParams = message.params;
          try {
            // @ts-ignore
            const { html, status, location } = await render(clientApp, params);
            parentPort.postMessage({
              name: 'render-result',
              data: { html, status, location, params },
            });
          } catch (error) {
            parentPort.postMessage({
              name: 'render-error',
              data: { error, params },
            });
          }
          break;
        }
      }
    }
  });
}
