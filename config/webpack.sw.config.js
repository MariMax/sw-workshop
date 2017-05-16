const path = require('path');

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
};