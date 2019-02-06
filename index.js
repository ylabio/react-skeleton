require('module-alias/register');
require('@babel/register')({
  presets: ['@babel/env', '@babel/react'],
});
require('@babel/polyfill');
require('ignore-styles');
require('./src/server');
