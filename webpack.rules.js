const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dev = process.env.NODE_ENV !== "production"

const esLintrules = {
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
  exclude: /(node_modules)/,
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
  esLintrules,
  babelRules,
  ejsRules,
  cssRules
];
