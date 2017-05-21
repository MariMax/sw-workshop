const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageJSON = require('../package.json');

process.env.NODE_ENV = "production";

module.exports = {
  entry: './sw.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'sw.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            ["transform-es2015-modules-commonjs"]
          ]
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: `./node_modules/workbox-precaching/build/importScripts/workbox-precaching.prod.v${packageJSON.devDependencies['workbox-precaching'].replace('^','')}.js`, to: '../build/workbox-precaching.js' },
      { from: `./node_modules/workbox-routing/build/importScripts/workbox-routing.prod.v${packageJSON.devDependencies['workbox-routing'].replace('^','')}.js`, to: '../build/workbox-routing.js' },
    ])
  ]
};