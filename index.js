require('module-alias/register');
require('@babel/register')({
  presets: ['@babel/env', '@babel/react'],
});
require('@babel/polyfill');
require('ignore-styles').default(['.less', '.css']);

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const projectBasePath = require('path').join(__dirname, '/src');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack-isomorphic-tools-config'))
  .server(projectBasePath, function () {
    require('./src/server');
  });
