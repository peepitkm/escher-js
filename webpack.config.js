// Webpack uses this to work with directories
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const name = isDev ? 'escher' : 'escher.min';

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

  // Path to your entry point. From this file Webpack will begin his work
  entry: {
    [name]: ['./lib/escher.js']
  },

  devtool: isDev ? 'inline-source-map' : false,
  stats: { warnings: false }, // Hide warnings

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Escher',
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript 
  // minifying and other thing so let's set mode to development
  mode: process.env.NODE_ENV || 'development',

  optimization: {
    chunkIds: isDev ? 'named' : 'total-size',
    minimize: !isDev,
    minimizer: isDev
      ? []
      : [
          new UglifyJsPlugin({
            // include: [path.resolve(__dirname, '../src')],
            cache: true,
            parallel: true,
            extractComments: true,
            uglifyOptions: {
              warnings: false,
              parse: {},
              compress: {},
              mangle: true,
              output: null,
              ie8: false,
              keep_fnames: false,
              toplevel: false,
            },
          }),
        ],
  },

};