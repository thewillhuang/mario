// NOTE: paths are relative to each functions folder
import webpack from 'webpack';
import path from 'path';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export default {
  entry: ['./src/index.js'],
  target: 'node',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  externals: ['aws-sdk', 'phantom', 'diskusage'],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // options: {
        //   cacheDirectory: true,
        // },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new UglifyJSPlugin({}),
  ],
};
