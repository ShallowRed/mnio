const path = require('path');
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
    path: path.resolve(__dirname, `./${outputPath}`),
    publicPath: `/${outputPath}/`
  },
  optimization: {
    minimize: !dev,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: Rules
  },
  plugins: Plugins({
    ejsEntry,
    name,
    outputName,
    inject: !!inject,
    isFavicon: !!isFavicon
  })
})

module.exports = config;
