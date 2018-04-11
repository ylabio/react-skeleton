if (typeof process.env.NODE_ENV === 'undefined') process.env.NODE_ENV = 'production';

console.log(process.env.NODE_ENV);

const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

let config = {
  mode: process.env.NODE_ENV,
  context: path.join(__dirname, "/src"),
  entry: [
    'babel-polyfill',
    'index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    // publicPath: '/dist/',
    // pathinfo: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html"
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
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              //minimize: true
            }
          }
        ]
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  //config.devtool = "nosources-source-map";
  //config.plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  // config.entry.push('webpack-dev-server/client?http://localhost:8030');
  // config.entry.push('webpack/hot/only-dev-server');
  config.devtool = 'inline-source-map';// "#cheap-module-inline-source-map";

  config.plugins.push(new webpack.NamedModulesPlugin());
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  config.devServer = {
    //compress: false,
    contentBase: path.join(__dirname, "dist"),
    port: 8030,
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    proxy: {
      '/api/**': {
        target: 'https://api.ysa.dev.cuberto.com',
        secure: true,
        changeOrigin: true
      },
    }
  };
}

module.exports = config;