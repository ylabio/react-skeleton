require('module-alias/register');
require('ignore-styles');
require('@babel/register')({
  presets: ['@babel/env'],
});
require('./src/server');
