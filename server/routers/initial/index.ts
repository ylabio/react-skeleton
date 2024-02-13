import {IRouteContext} from "../../types";

/**
 * Роут для отдачи состояния (данных) после рендера React приложения
 * Состояние не отправляется вместе с HTML, его необходимо запросить по ключу
 */
export default async ({app, cacheStore}: IRouteContext) => {
  // Выборка состояния с которым выполнялся рендер
  // Выборка доступна один раз
  app.get('/initial/:key', async (req, res) => {
    const key = req.params.key;
    const secret = req.cookies.stateSecret;
    res.json(cacheStore.getDump(key, secret) || {});
  });
};
