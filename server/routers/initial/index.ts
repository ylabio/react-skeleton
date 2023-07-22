import {IRouteContext} from "../../types";

/**
 * Роут для отдачи состояния (данных) после рендера React приложения
 * Состояние не отправляется вместе с HTML, его необходимо запросить по ключу
 * Состояние можно получить один раз, после чего оно удаляется из хранилища.
 * @param app
 * @param initialStore
 */
export default async ({app, initialStore}: IRouteContext) => {
  // Выборка состояния с которым выполнялся рендер
  // Выборка доступна один раз
  app.get('/initial/:key', async (req, res) => {
    const key = req.params.key;
    const secret = req.cookies.stateSecret;
    res.json(initialStore.get({key, secret}) || {});
  });
};
