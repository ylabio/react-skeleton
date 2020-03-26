const isWeb = process.env.TARGET === 'web';

let config = {
  api: {
    apiUrl: isWeb ? '' : 'http://localhost:8101',
    tokenHeader: 'X-Token',
  },
  routing: {
    basename: '/', // если фронт доступен по вложенному пути
    type: isWeb ? 'browser' : 'memory'
  },
  ssr: {
    host: 'localhost',
    port: 8102
  }
};

module.exports = config;
