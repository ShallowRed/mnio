const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dev = process.env.NODE_ENV !== "production"
console.log("Dev mode :", dev);

const esLintRules = {
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  use: {
    loader: 'eslint-loader',
    options: {
      emitWarning: true,
    }
  },
};

const babelRules = {
  test: /\.js$/,
  // exclude: /(node_modules)|(games)|(gallery)|(game)/,
  exclude: /node_modules/,
  use: 'babel-loader'
};

const ejsRules = {
  test: /\.ejs$/,
  use: [{
    loader: 'ejs-loader',
    options: {
      esModule: false
    }
  }]
};

const removeDebug = {
  test: /\.js$/,
  loader: 'webpack-remove-debug'
};

const cssRules = {
  test: /\.css$/,
  use: [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: dev,
        reloadAll: true
      },
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: (loader) => [
          require("postcss-normalize")(),
          require("postcss-preset-env")({
            stage: 3,
            features: {
              'nesting-rules': true
            }
          })
        ]
      }
    }
  ]
}

module.exports = [
  dev ? esLintRules : false,
  !dev ? removeDebug : false,
  // !dev ? babelRules : false,
  ejsRules,
  cssRules
].filter(Boolean);
