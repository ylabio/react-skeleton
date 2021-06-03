const webpackConfig = require('../webpack.config.js');
const path = require('path');

module.exports = {
  module: webpackConfig.module,
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src/'),
    }
  }
};
