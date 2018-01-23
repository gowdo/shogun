const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src');
const JS_DIR = path.resolve(__dirname, 'js');
// const BUILD_DIR = path.resolve(__dirname, 'public');
const PHASER_DIR = path.join(__dirname, '/node_modules/phaser-ce');
// const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/app.js",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [APP_DIR, 'node_modules'],
    alias: {
      // https://github.com/webpack/webpack/issues/4666
      // constants: `${APP_DIR}/constants`,
      phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
      pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
      p2: path.join(PHASER_DIR, 'build/custom/p2.js'),
      phaserIsometric: path.join(JS_DIR, 'phaser-plugin-isometric.min.js'),
    },
  },
  // devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin([
      { from: 'index-build.html', to: 'index.html' },
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'styles', to: 'styles' },
      { from: 'img', to: 'img' },
      { from: 'js/phaser-plugin-isometric.min.js', to: 'js/phaser-plugin-isometric.min.js' },
    ])
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        attrs: [':data-src']
      }
    },
    {
      test: /\.svg$/,
      loader: 'svg-inline'
    },
    {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    },
    {
      test: /pixi\.js/,
      use: [{
        loader: 'expose-loader',
        options: 'PIXI',
      }],
    },
    {
      test: /phaser-split\.js$/,
      use: [{
        loader: 'expose-loader',
        options: 'Phaser',
      }],
    },
    {
      test: /p2\.js/,
      use: [{
        loader: 'expose-loader',
        options: 'p2',
      }],
    }]
  }
};
