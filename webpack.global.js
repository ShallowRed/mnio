const path = require('path');
const Rules = require('./webpack.rules.js');
const Plugins = require('./webpack.plugins.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dev = process.env.NODE_ENV !== "production";

const entry = (name, obj = new Object()) => {
  obj[name] = path.resolve(__dirname, `./app/${name}/index.js`);
  return obj;
};

const config = ({
  name,
  outputPath,
  htmlOutputFileName,
  inject,
  isFavicon
}) => ({
  target: "web",
  mode: dev ? 'development' : 'production',
  watch: dev,
  entry: entry(name),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `./${outputPath}`),
    publicPath: '/dist/'
  },
  optimization: {
    minimize: !dev,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: Rules
  },
  plugins: Plugins({
    name: name,
    htmlOutputFileName: htmlOutputFileName,
    inject: !!inject,
    isFavicon: !!isFavicon
  })
})

module.exports = config;
