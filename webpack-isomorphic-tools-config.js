const path = require('path');

module.exports = {
  webpack_assets_file_path: path.join(__dirname, '/dist/webpack-assets.json'),
  webpack_stats_file_path: path.join(__dirname, '/dist/webpack-stats.json'),
  assets:
    {
      svg:
        {
          extensions: ['svg'],
          runtime: true
        }
      ,
      images:
        {
          extensions: ['png', 'swf', 'jpg', 'jpeg', 'gif', 'ico']
        }
      ,
      fonts:
        {
          extensions: ['otf', 'eot', 'ttf', 'woff', 'woff2']
        }
      ,
    }
};
