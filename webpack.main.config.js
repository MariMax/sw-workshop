const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const commonConfig = require('./webpack.common.config');

const assetsPlugin = new AssetsPlugin({
  metadata: {version: package.version},
  path: './src',
  fullPath: false,
  prettyPrint: true,
  filename: 'assets.json'
});

module.exports = Object.assign({}, commonConfig,{
  entry: {
    bundle: './src/js/scripts.js',
  },
  module:{
    rules:[
      ...commonConfig.module.rules,
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [ {loader: 'css-loader'} ]
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true,
    }),
    assetsPlugin,

    new HtmlWebpackPlugin({ template: './index.html' }),
  ]
});