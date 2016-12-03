// NOTE: paths are relative to each functions folder
// const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: './dist',
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  externals: [
    // included modules on lambda
    'imagemagick',
    'aws-sdk',
    // [native c/c++] modules and
    'scrypt',
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};
