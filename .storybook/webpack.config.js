const webpackConfig = require('../webpack.config.js');
const path = require('path');

module.exports = {
  module: webpackConfig.module,
  resolve: {
    alias: {
      '@src/components': path.resolve(__dirname, '../src/components/'),
      '@src/containers': path.resolve(__dirname, '../src/containers/'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@src/store': path.resolve(__dirname, '../src/store/'),
      '@src/utils': path.resolve(__dirname, '../src/utils/'),
      '@src/api': path.resolve(__dirname, '../src/api/'),
      '@hoc-components': path.resolve(__dirname, './src/hoc-components/'),
    }
  }
};
