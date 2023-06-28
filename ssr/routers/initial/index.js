export default async ({app, initialStore}) => {
  // Выборка состояния с которым выполнялся рендер
  // Выборка доступна один раз
  app.get('/initial/:key', async (req, res) => {
    const key = req.params.key;
    const secret = req.cookies.stateSecret;
    res.json(initialStore.get({key, secret}));
  });
};
