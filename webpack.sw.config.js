const commonConfig = require('./webpack.common.config');
const path = require('path');

module.exports = Object.assign({}, commonConfig, {
  entry: './sw.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sw.js',
  }
});