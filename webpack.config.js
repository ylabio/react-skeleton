if (typeof process.env.NODE_ENV === 'undefined') process.env.NODE_ENV = 'production';

console.log(process.env.NODE_ENV);

let path = require('path');
let webpack = require('webpack');

let config = {
  context: path.join(__dirname, "/src"),
  entry: [
    'babel-polyfill',
    'index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    // publicPath: '/dist/',
    // pathinfo: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  resolve: {
    extensions: [/*'', */'.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{loader: 'babel-loader'}]
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {url: true}},
        ]
      },
      {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {url: true}},
          {loader: 'less-loader', options: {url: true}},
        ]
      },
      {
        test: /\.(svg|png|swf|jpg|otf|eot|ttf|woff|woff2)(\?.*)?$/,
        use: [
          {loader: 'url-loader', options: {limit: 100000, name: 'assets/[hash].[ext]'}}
        ]
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = "nosources-source-map";
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  // config.entry.push('webpack-dev-server/client?http://localhost:8020');
  // config.entry.push('webpack/hot/only-dev-server');
  config.devtool = "#cheap-module-inline-source-map";
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  config.devServer = {
    //compress: false,
    contentBase: path.join(__dirname, "dist"),
    port: 8020,
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    proxy: {
      '/api/**': {
        target: 'http://appinside.yiilab.com',
        secure: false,
        changeOrigin: true
      },
    }
  };
}

module.exports = config;