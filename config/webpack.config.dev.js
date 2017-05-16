'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');



var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);
const cssFilename = 'bundle.css';

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: paths.appIndexJs,
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{ loader: 'css-loader' }]
        }),
      },
    ]
  },

  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new ExtractTextPlugin(cssFilename),
    new webpack.DefinePlugin(env.stringified),
  ],
};
