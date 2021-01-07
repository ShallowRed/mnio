const path = require('path');
const webpack = require('webpack');
const Rules = require('./webpack.rules.js');
const Plugins = require('./webpack.plugins.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const dev = process.env.NODE_ENV !== "production";
console.log("Dev mode :", dev);

const config = ({
  jsEntry,
  ejsEntry,
  name,
  outputPath,
  outputName,
  inject,
  isFavicon
}) => ({
  target: "web",
  mode: dev ? 'development' : 'production',
  watch: dev,
  entry: jsEntry,
  output: {
    filename: `${name}.js`,
    path: path.resolve(__dirname, `./serve/${outputPath}`),
    publicPath: `/${outputPath}/`
  },
  optimization: {
    minimize: !dev,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: Rules
  },
  plugins: [
    ...Plugins({
      dev,
      ejsEntry,
      name,
      outputName,
      inject: !!inject,
      isFavicon: !!isFavicon
    }),
    // new webpack.HotModuleReplacementPlugin({
    //   multiStep: true
    // })
  ],
  // devServer: {
  //   contentBase: path.resolve(__dirname, "./dist/login"),
  //   historyApiFallback: true,
  //   hot: true,
  //   inline: true,
  //   open: true,
  //   hot: true,
  //   host: 'localhost', // Defaults to `localhost`
  //   port: 4000, // Defaults to 8080
  //   proxy: {
  //     '/': {
  //       target: 'http://localhost:3000/',
  //       secure: false
  //     }
  //   }
  // },
  // devtool: "eval-source-map"
});

module.exports = config;
