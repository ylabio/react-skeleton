if (typeof process.env.NODE_ENV === 'undefined')  process.env.NODE_ENV = 'production';

var path = require('path');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV === 'production';

console.log(process.env.NODE_ENV);

// common
var entry = [
    'babel-polyfill','./entry.js'
];
var jsLoaders = [
    'babel-loader'
];
var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
];

if (isProduction) {
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}else{
    entry.push('webpack-dev-server/client?http://localhost:8090');
    entry.push('webpack/hot/only-dev-server');
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    devtool: "#cheap-module-inline-source-map",
    context: path.join(__dirname, "/src"),
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/',
        pathinfo: true
    },
    plugins: plugins,
    resolve: {
        alias: {},
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: jsLoaders
            },
            {
                test: /\.css$/,
                loader: 'style!css?-url'
            },
            {
                test: /\.less$/,
                loader: 'style!css?-url!less?-url'
            },
            {
                test: /\.(svg|png|swf|jpg|otf|eot|ttf|woff|woff2)(\?.*)?$/,
                loader: 'url?limit=100000&name=assets/[hash].[ext]'
            }
        ]
    }
};