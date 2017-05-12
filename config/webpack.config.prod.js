'use strict';

var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var paths = require('./paths');
var getClientEnvironment = require('./env');



var publicPath = paths.servedPath;
var shouldUseRelativeAssetPaths = publicPath === './';
var publicUrl = publicPath.slice(0, -1);
var env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? { publicPath: Array(cssFilename.split('/').length).join('../') }
  : undefined;

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: paths.appIndexJs,
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: publicPath
  },
  resolve: {
    fallback: paths.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
  },
  
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?importLoaders=1',
          extractTextPluginOptions
        )
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },

  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin(env.stringified),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin(cssFilename)
  ],
};
