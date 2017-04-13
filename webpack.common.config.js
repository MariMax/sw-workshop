const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    chunkFilename: "[id].[chunkhash].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            // ['es2015', {module: false}]
            ["transform-es2015-modules-commonjs"]
          ]
        }
      }
    ]
  },
};