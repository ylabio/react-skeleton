require('module-alias/register');
require('@babel/register')({
  presets: ['@babel/env'],
});
require('@babel/polyfill');
require('ignore-styles');
require('./src/server');
