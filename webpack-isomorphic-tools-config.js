const path = require('path');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {
  webpack_assets_file_path: path.join(__dirname, '/dist/webpack-assets.json'),
  webpack_stats_file_path: path.join(__dirname, '/dist/webpack-stats.json'),
  assets: {
    svg: {
      extension: 'svg',
      runtime: true
    },
    images: {
      extensions: ['png', 'swf', 'jpg', 'jpeg', 'gif', 'ico']
    },
    fonts: {
      extensions: ['otf', 'eot', 'ttf', 'woff', 'woff2']
    },
    styles: {
      extensions: ['less', 'scss'],
      filter: WebpackIsomorphicToolsPlugin.styleLoaderFilter,
      path: WebpackIsomorphicToolsPlugin.styleLoaderPathExtractor,
      parser: WebpackIsomorphicToolsPlugin.cssLoaderParser
    }
  }
};
