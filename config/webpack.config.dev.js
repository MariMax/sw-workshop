const webpack = require('webpack');
const package = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const assetsPlugin = new AssetsPlugin({
  metadata: { version: package.version },
  path: './src',
  fullPath: false,
  prettyPrint: true,
  filename: 'assets.json'
});

const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);
const cssFilename = 'static/css/bundle.css';

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
    assetsPlugin,
  ],
};
